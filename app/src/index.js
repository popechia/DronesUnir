import Web3 from "web3";
import regPropArtifact from "../../build/contracts/RegProp.json";
import plotArtifact from "../../build/contracts/Plot.json";

const App = {
  web3: null,
  account: null,
  regProp: null,
  plot: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      console.log("==>" + networkId);
      //const accounts = await web3.eth.getAccounts();
      this.account = window.ethereum.selectedAddress;
      const deployedNetwork = regPropArtifact.networks[networkId];
      var plotInstance;
      this.regProp = await new web3.eth.Contract(
        regPropArtifact.abi,
        deployedNetwork.address,
      );

      this.plot = await new web3.eth.Contract(plotArtifact.abi);
      this.plot.options.data = plotArtifact.bytecode;
      let code = plotArtifact.bytecode;
      //console.log(code);
      await this.plot.deploy({
        data: code,
        arguments: []
      }).send({ from: this.account, gas: 500000 }).then((instance) => { plotInstance = instance });

      /* CREACION DE PARCELAS NUEVAS
      
      console.log("======>" + plotInstance.options.address);
      await plotInstance.methods.initialize(10, 10, 0).send({ from: this.account, gas: 300000 })
        .on('error', console.error);

      let idPlot = await this.regProp.methods.createPlot(plotInstance.options.address, this.account).send({ from: this.account, gas: 300000 })
        .on('error', console.error)
        .on('receipt', (result) => {
          plotInstance.methods.setId(result.events.plotRegistered.returnValues.plotId).send({ from: this.account, gas: 300000 })
            .on('error', console.error);

        });
*/
      // get accounts
      //const accounts = await web3.eth.getAccounts();
      this.getCuentas();
      //this.showPlot(plotInstance);
      await this.showPlots(this.account, web3, this.account);
    } catch (error) {
      console.log(error);
      console.error("Could not connect to contract or chain.");
    }
  },

  showPlots: async function (_owner, _web3, _from) {
    const { getPlotsOwner } = this.regProp.methods;
    const { getPlot } = this.regProp.methods;
    const _plots = await getPlotsOwner(_owner).call();
    console.log("..>"+_plots.length);
    const _plotsList = document.getElementById("plotsList");
    var _length = _plotsList.options.length;
    for (var i=0;i<=_length;i++){
      console.log("Remove:"+i);
      _plotsList.options[i]=null;
    }
    console.log(_plotsList.options.length);
    _plots.forEach(async function (_plot, index) {
      const _pl = await getPlot(_plot).call();
      const _plInstance = await new _web3.eth.Contract(
        plotArtifact.abi,
        _pl,
      );
      //await _plInstance.methods.setId(_plot).send({ from: _from, gas: 300000 });
      //console.log(_pl + "===" + await _plInstance.methods.getId().call());
      _plotsList.add(new Option(_pl,await _plInstance.methods.getId().call()));
    });
  },

  showPlot: async function (_plot) {
    const { getSurface } = _plot.methods;
    const balance = await getSurface().call();
    const plotElement = document.getElementsByClassName("plot")[0];
    plotElement.innerHTML = balance;
  },

  getCuentas: async function () {
    const { getTotalPlots } = this.regProp.methods;
    const balance = await getTotalPlots().call();
    const name = await this.regProp.methods.name().call();
    console.log(name);
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
    console.log(_selectedPlot +"TO->" + _receiver);
    const { safeTransferFrom } = this.regProp.methods;
    await safeTransferFrom(this.account,  _receiver, _selectedPlot).send({ from: this.account });

    this.setStatus("Transaction complete!");
    //this.refreshBalance();
  },

  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.ethereum.on('accountsChanged', async function (accounts) {
  this.account = window.ethereum.selectedAddress;
  console.log(this.account);
  await App.showPlots(this.account,App.web3,this.account);
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
