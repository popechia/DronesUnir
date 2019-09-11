import Web3 from "web3";
import regPropArtifact from "../../../build/contracts/RegProp.json";
import plotArtifact from "../../../build/contracts/Plot.json";
import landOwnerArtifact from "../../../build/contracts/LandOwner.json";
import droneCoinArtifact from "../../../build/contracts/DronCoin.json";

const App = {
  web3: null,
  account: null,
  regProp: null,
  owner : null,
  landOwner: null,
  dronCoin: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      this.account = window.ethereum.selectedAddress;
      panelPlot
      document.getElementById("panelPlot").style.display = "none";
      var deployedNetwork = regPropArtifact.networks[networkId];
      this.regProp = await new web3.eth.Contract(
        regPropArtifact.abi,
        deployedNetwork.address,
        { from: this.account },
      );
      console.log(this.regProp.options.address);
      this.owner = await this.regProp.methods.owner().call();
      if (this.account.toUpperCase() == this.owner.toUpperCase()) {
        document.getElementById("panelPlot").style.display = "block";
      }
      deployedNetwork = landOwnerArtifact.networks[networkId];
      this.landOwner = await new web3.eth.Contract(
        landOwnerArtifact.abi,
        deployedNetwork.address,
        { from: this.account },
      );
      deployedNetwork = droneCoinArtifact.networks[networkId];
      this.dronCoin = await new web3.eth.Contract(
        droneCoinArtifact.abi,
        deployedNetwork.address,
        { from: this.account },
      );
      console.log(this.landOwner.options.address);
      var _amount = this.dronCoin.methods.balanceOf(this.account).call().then((result) => console.log(result));
      //CREACION DE PARCELAS NUEVAS
      //await this.createNewPlot();

      this.getCuentas();
      await this.showPlots();
      document.getElementById("plotsList").addEventListener("change", this.showPlot);

/*
      this.landOwner.events.workBided(function (err, events) { console.log(events); })
      .on('data', async function (event) {
        var _plot = event.returnValues._plot;
        var _owner= event.returnValues._owner;
        var _ts =  event.returnValues._timestamp;
        var _amount = event.returnValues._amount;
        var _drone = event.returnValues._drone;
        console.log("1_plot:"+_plot);
        console.log("1_owner:"+_owner);
        console.log("1_ts:"+_ts);
        console.log("1_amount:"+_amount);
        console.log("1_drone:"+_drone);
        
       // var _plotInstance = await Cia.searchPlot(_plot);
       // var _table = document.getElementById("worksTable");
       // var _row = _table.insertRow(-1);
      });*/

    } catch (error) {
      console.log(error);
      console.error("Could not connect to contract or chain.");
    }
  },

  createNewPlot: async function () {
    var plot = await new App.web3.eth.Contract(plotArtifact.abi, { from: this.account });
    var plotInstance;
    plot.options.data = plotArtifact.bytecode;
    let code = plotArtifact.bytecode;
    await plot.deploy({
      data: code,
      arguments: []
    }).send({ from: this.account, gas: 500000 })
      .on('error', (error) => {
        const _error = document.getElementsByClassName("errorCreate")[0];
        _error.innerHTML = "Transacción incorrecta";
      })
      .then(instance => {
        plotInstance = instance;
      });
    console.log("======>" + plotInstance.options.address);

    const _surface = document.getElementById("surfaceTXT").value;
    const _maxHeight = document.getElementById("maxHeightTXT").value;
    const _minHeight = document.getElementById("minHeightTXT").value;
    const _owner = document.getElementById("ownerTXT").value;
    const _pos = document.getElementById("posTXT").value;
    await plotInstance.methods.initialize(_surface, _maxHeight, _minHeight,_pos).send({ from: this.account, gas: 300000 })
      .on('error', console.error);

    let idPlot = await this.regProp.methods.createPlot(plotInstance.options.address, _owner).send({ from: this.account, gas: 300000 })
      .on('error', (error) => {
        const _error = document.getElementsByClassName("errorCreate")[0];
        _error.innerHTML = "Solo puede ser ejecutada por el propietario del registro";
      })
      .on('receipt', async (result) => {
        plotInstance.methods.setId(result.events.plotRegistered.returnValues.plotId).send({ from: this.account, gas: 300000 })
          .on('error', console.error);
        await App.showPlots();
      });

  },

  createNewCompany: async function (_name) {
    var fumigationCO = await new App.web3.eth.Contract(fumigationCOArtifact.abi);
    var fumigationCOInstance;
    fumigationCO.options.data = fumigationCOArtifact.bytecode;
    let code = fumigationCOArtifact.bytecode;
    await fumigationCO.deploy({
      data: code,
      arguments: [_name]
    }).send({ from: this.account, gas: 1000000 }).then((instance) => { fumigationCOInstance = instance });
    return fumigationCOInstance.options.address;
  },


  showPlots: async function () {
    const { getPlotsOwner } = App.regProp.methods;
    const { getPlot } = App.regProp.methods;
    const _plots = await getPlotsOwner(App.account).call();
    const _plotsList = document.getElementById("plotsList");
    document.getElementById("transferPlotBTN").disabled = true;
    var _length = _plotsList.options.length;
    for (var i = 0; i < _length; i++) {
      _plotsList.remove(0);
    }
    let _flag = 0;

    _plots.forEach(async function (_plot, index) {
      const _pl = await getPlot(_plot).call();
      const _plInstance = await new App.web3.eth.Contract(
        plotArtifact.abi,
        _pl,
      );
      _plotsList.add(new Option(_pl, await _plInstance.methods.getId().call()));
      if (_flag <= 0) {
        App.showPlotObject(_plInstance);
        _flag += 1;
      }
    });
    _length = _plots.length;
    document.getElementById("transferPlotBTN").disabled = (_length <= 0);
  },

  showPlot: async function (_selectedPlot) {
    const _plotList = document.getElementById("plotsList");
    if (_plotList.selectedIndex >= 0) {
      const _selectedPlot = _plotList.options[_plotList.selectedIndex].value;
      const { getPlot } = App.regProp.methods;
      const _plot = await getPlot(_selectedPlot).call();
      var _plotInstance;
      _plotInstance = await new App.web3.eth.Contract(plotArtifact.abi, _plot);
      App.showPlotObject(_plotInstance);
    }
  },

  showPlotObject: async function (_plotInstance) {
    //const _surface = await _plotInstance.methods.getSurface().call();
    const _idPlot = await _plotInstance.methods.getId().call();
    const _surfacePlot = await _plotInstance.methods.getSurface().call();
    const _maxHPlot = await _plotInstance.methods.getMaxHeight().call();
    const _minHPlot = await _plotInstance.methods.getMinHeight().call();
    const _posPlot = await _plotInstance.methods.getPos().call();
    const plotIdElement = document.getElementById("plotId");
    const plotSurfaceElement = document.getElementById("plotSurface");
    const plotMaxElement = document.getElementById("plotMinHeight");
    const plotMinElement = document.getElementById("plotMaxHeight");
    const posElement = document.getElementById("plotPos");

    plotIdElement.innerHTML = _idPlot;
    plotSurfaceElement.innerHTML = _surfacePlot;
    plotMaxElement.innerHTML = _maxHPlot;
    plotMinElement.innerHTML = _minHPlot;
    posElement.innerHTML = _posPlot;
  },

  getCuentas: async function () {
    const { getTotalPlots } = this.regProp.methods;
    const balance = await getTotalPlots().call();
    const name = await this.regProp.methods.name().call();
    const registroElement = document.getElementsByClassName("registro")[0];
    registroElement.innerHTML = name;
    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },

  transferPlot: async function () {
    const _plotList = document.getElementById("plotsList");
    const _selectedPlot = _plotList.options[_plotList.selectedIndex].value;
    const _receiver = document.getElementById("receiver").value;
    this.setStatus("Initiating transaction... (please wait)");
    const { safeTransferFrom } = this.regProp.methods;
    await safeTransferFrom(this.account, _receiver, _selectedPlot).send({ from: this.account });
    this.setStatus("Transaction complete!");
    await App.showPlots();
  },

  generateCO: async function () {
    const _nameCO = document.getElementById("nameCO").value;
    var _addrCO = await App.createNewCompany(_nameCO);
    console.log("Address CO:" + _addrCO);
    document.getElementById("generateCOBTN").disabled = true;
  },

  fumigate: async function () {
    const _plotList = document.getElementById("plotsList");
    if (_plotList.selectedIndex >= 0) {
      const _selectedPlot = _plotList.options[_plotList.selectedIndex].value;
      const { getPlot } = App.regProp.methods;
      const _plotAddress = await getPlot(_selectedPlot).call();
      console.log("publish work:"+_plotAddress+"--> "+ App.account);
      App.landOwner.methods.publishWork(_plotAddress).send({ from: App.account, gas: 500000 })
      .on('error', (error) => {
        const _error = document.getElementById("status");
        _error.innerHTML = "Transacción incorrecta";
      });
      App.landOwner.events.workBided({filter : {_plot : _plotAddress}},function (err, events) { console.log(events); })
      .on('data', async function (event) {
        var _plot = event.returnValues._plot;
        var _owner= event.returnValues._owner;
        var _ts =  event.returnValues._timestamp;
        var _amount = event.returnValues._amount;
        var _drone = event.returnValues._drone;
        console.log("_plot:"+_plot);
        console.log("_owner:"+_owner);
        console.log("_ts:"+_ts);
        console.log("_amount:"+_amount);
        console.log("_drone:"+_drone);
        
       // var _plotInstance = await Cia.searchPlot(_plot);
       // var _table = document.getElementById("worksTable");
       // var _row = _table.insertRow(-1);
      });
      /*
      .then(instance => {
        plotInstance = instance;
      });*/
//      _plotInstance = await new App.web3.eth.Contract(plotArtifact.abi, _plot);
    }
    console.log("fumigate");
  },

  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.ethereum.on('accountsChanged', async function (accounts) {
  App.account = window.ethereum.selectedAddress;
  await App.showPlots();
  document.getElementById("panelPlot").style.display = "none";
  if (App.account.toUpperCase() == App.owner.toUpperCase()) {
    document.getElementById("panelPlot").style.display = "block";
  }
});

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
