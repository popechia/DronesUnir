import Web3 from "web3";
import droneERC721Artifact from "../../../build/contracts/DroneERC721.json";
import fumigationCOArtifact from "../../../build/contracts/FumigationCO.json";
import droneArtifact from "../../../build/contracts/Drone.json";
import landOwnerArtifact from "../../../build/contracts/LandOwner.json";
import regPropArtifact from "../../../build/contracts/RegProp.json";
import plotArtifact from "../../../build/contracts/Plot.json";

const Cia = {
  web3: null,
  account: null,
  accountOrigin: null,
  companyAddress: null,
  droneFactory: null,
  drone: null,
  landOwner: null,
  regProp: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      //console.log("==>" + networkId);
      //const accounts = await web3.eth.getAccounts();
      this.account = window.ethereum.selectedAddress;
      this.accountOrigin = window.ethereum.selectedAddress;

      var deployedNetwork = droneERC721Artifact.networks[networkId];
      this.droneFactory = await new web3.eth.Contract(
        droneERC721Artifact.abi,
        deployedNetwork.address,
      );
      deployedNetwork = landOwnerArtifact.networks[networkId];
      this.landOwner = await new web3.eth.Contract(
        landOwnerArtifact.abi,
        deployedNetwork.address,
        { from: this.account },
      );
      deployedNetwork = regPropArtifact.networks[networkId];
      this.regProp = await new web3.eth.Contract(
        regPropArtifact.abi,
        deployedNetwork.address,
        { from: this.account },
      );

      document.getElementById("factoryNameP").innerHTML = this.droneFactory.options.address;
      console.log("DroneFactory address:" + this.droneFactory.options.address);
      this.companyAddress = "0xABC0761c632d259718Fd42cbD543963aad7d9F90";
      this.showDrones(this.companyAddress);

      this.landOwner.events.WorkPublished(async (err, events) => {
        var _plot = events.returnValues._plot;
        console.log("evento:.:::::" + _plot);
        var _plotInstance = await Cia.searchPlot(_plot);
        var _table = document.getElementById("worksTable");
        var _row = _table.insertRow(0);
        this.showPlotObject(_plotInstance, _row);
       /* var _cell1 = _row.insertCell(0);
        var _cell2 = _row.insertCell(1);
        _cell1.innerHTML = await _plotInstance.methods.getId().call();
        _cell2.innerHTML = "<button onclick='App.bidWork()' id='bidWorkBTN'>Pujar</button>";*/
      });
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  bidWork: async function (_id) {
    console.log("BID "+_id);
  },

  searchPlot: async function (_selectedPlot) {
    var _plotInstance;
    _plotInstance = await new App.web3.eth.Contract(plotArtifact.abi, _selectedPlot);
    return _plotInstance;
  },

  showPlotObject: async function (_plotInstance, _row) {
    const _idPlot = await _plotInstance.methods.getId().call();
    const _surfacePlot = await _plotInstance.methods.getSurface().call();
    const _maxHPlot = await _plotInstance.methods.getMaxHeight().call();
    const _minHPlot = await _plotInstance.methods.getMinHeight().call();
    const plotIdElement = _row.insertCell(0);
    const plotSurfaceElement = _row.insertCell(1);
    const plotMaxElement = _row.insertCell(2);
    const plotMinElement = _row.insertCell(3);
    plotIdElement.innerHTML = _idPlot;
    plotSurfaceElement.innerHTML = _surfacePlot;
    plotMaxElement.innerHTML = _maxHPlot;
    plotMinElement.innerHTML = _minHPlot;
    _row.insertCell(4).innerHTML = "<button onclick='App.bidWork("+_idPlot+")' id='bidWorkBTN'>Pujar</button>";

  },


  createNewCompany: async function (_name) {
    var fumigationCO = await new Cia.web3.eth.Contract(fumigationCOArtifact.abi);
    var fumigationCOInstance;
    fumigationCO.options.data = fumigationCOArtifact.bytecode;
    let code = fumigationCOArtifact.bytecode;
    await fumigationCO.deploy({
      data: code,
      arguments: [_name]
    }).send({ from: this.account, gas: 1000000 }).then((instance) => { fumigationCOInstance = instance });
    console.log(await fumigationCOInstance.methods.getName().call());
    Cia.companyAddress = fumigationCOInstance.options.address;
    return fumigationCOInstance.options.address;
  },

  deployExistingCompany: async function (_address) {
    var fumigationCOInstance = new Cia.web3.eth.Contract(
      fumigationCOArtifact.abi,
      _address,
    );
    Cia.companyAddress = fumigationCOInstance.options.address;
    return fumigationCOInstance;
  },

  deployCO: async function () {
    const _addressCo = document.getElementById("addressCO").value;
    var _instanceCO = await Cia.deployExistingCompany(_addressCo);
    Cia.companyAddress = _instanceCO.options.address;
    document.getElementsByClassName("nombreCO")[0].innerHTML = await _instanceCO.methods.getName().call();
    document.getElementById("generateCOBTN").disabled = true;
  },

  generateCO: async function () {
    const _nameCO = document.getElementById("nameCO").value;
    var _addrCO = await Cia.createNewCompany(_nameCO);
    console.log("Generated company:" + _addrCO);
    document.getElementsByClassName("nombreCO")[0].innerHTML = _nameCO;
    document.getElementById("generateCOBTN").disabled = true;
  },


  showDrones: async function (_owner) {
    const { getDronesOwner } = Cia.droneFactory.methods;
    const _drones = await getDronesOwner(_owner).call();
    document.getElementById("numberDrones").innerHTML = _drones.length;
    const _dronesList = document.getElementById("dronesList");

    var _length = _dronesList.options.length;
    for (var i = 0; i < _length; i++) {
      _dronesList.remove(0);
    }
    //let _flag = 0;

    _drones.forEach(async function (_dr, index) {
      const _drone = await Cia.droneFactory.methods.getDrone(_dr).call();
      const _droneInstance = await new App.web3.eth.Contract(
        droneArtifact.abi,
        _drone,
      );
      const _text = await _droneInstance.methods.getId().call() + "->" + await _droneInstance.methods.getRange().call();
      _dronesList.add(new Option(_text, await _droneInstance.methods.getId().call()));
      /*if (_flag<=0) {
        App.showPlotObject(_plInstance);
        _flag+= 1;        
      }*/
    });
    _length = _drones.length;
    //document.getElementById("transferPlotBTN").disabled = (_length <= 0);
  },

  buyDrone: async function () {
    const _owner = Cia.companyAddress;
    const _range = document.getElementById("rangeDroneInput").value;
    console.log(Cia.companyAddress);
    console.log(_owner + "::" + _range);
    await Cia.buyDrone1(_owner, _range);
    await Cia.showDrones(_owner);
  },

  buyDrone1: async function (_owner, _range) {
    await Cia.droneFactory.methods.buildDrone(_owner, 10, 1, _range).send({ from: this.account, gas: 3000000 })
      .on('error', console.error)
      .on('receipt', (result) => { console.log(result) });
  },


};

window.App = Cia;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    Cia.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dCia id mgmt / fail)
    Cia.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  Cia.start();
});
