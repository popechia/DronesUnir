import Web3 from "web3";
import droneERC721Artifact from "../../../build/contracts/DroneERC721.json";
import fumigationCOArtifact from "../../../build/contracts/FumigationCO.json";
import droneArtifact from "../../../build/contracts/Drone.json";
import landOwnerArtifact from "../../../build/contracts/LandOwner.json";
import regPropArtifact from "../../../build/contracts/RegProp.json";
import plotArtifact from "../../../build/contracts/Plot.json";
import droneCoinArtifact from "../../../build/contracts/DronCoin.json";


const Cia = {
  web3: null,
  account: null,
  companyAddress: null,
  droneFactory: null,
  drones: [],
  landOwner: null,
  regProp: null,
  dronCoin: null,
  publishedWorks: [],

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      this.account = window.ethereum.selectedAddress;
      console.log("this.account:" + this.account);

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
      deployedNetwork = droneCoinArtifact.networks[networkId];
      this.dronCoin = await new web3.eth.Contract(
        droneCoinArtifact.abi,
        deployedNetwork.address,
        { from: this.account },
      );

      this.companyAddress = "0x8734b1d3F5A02d4E1417343CD35d83c25e62AD37";
      this.deployCompany(this.companyAddress);
      document.getElementById("factoryNameP").innerHTML = this.droneFactory.options.address;

      this.landOwner.events.WorkPublished(function (err, events) { console.log(events.logIndex + "---" + events.blocNumber); })
        .on('data', async function (event) {
          var _plot = event.returnValues._plot;
          var _plotInstance = await Cia.searchPlot(_plot);
          var _table = document.getElementById("worksTable");
          var _owner = event.returnValues._owner;
          console.log("Owner of the plot:" + _owner);
          var _row = _table.insertRow(-1);
          Cia.showPlotObject(_plotInstance, _row, _owner);
          Cia.landOwner.events.WorkFinished(function (err, event) { console.log(event.transactionIndex); })
            .on('data', function (events) {
              var _worker = events.returnValues._owner;
              Cia.showDrones(Cia.companyAddress);
              _plotInstance.methods.getId().call()
                .then((result) => {
                  var _plotId = result;
                  console.log("Eliminar pujas:" + _plotId);
                  var _bidTable = document.getElementById("worksTable");
                  for (var r = _bidTable.rows.length - 1; r >= 0; r--) {
                    if (_bidTable.rows[r].cells[0].innerHTML == _plotId) {
                      _bidTable.deleteRow(r);
                    }
                  }
                });
            });

        });
    } catch (error) {
      console.log(error);
      console.error("Could not connect to contract or chain.");
    }
  },

  showWorks: async function () {
    Cia.publishedWorks.forEach(function (_work, _index) {
      console.log("=====" + _work);
    });
  },

  bidWork: async function (_plotAddress, _rowIndex, _owner) {
    console.log("BID " + _plotAddress);
    const _plotInstance = await Cia.searchPlot(_plotAddress);
    const _position = await _plotInstance.methods.getPos().call();
    var _selectedDrone = await Cia.nearestDrone(_position);
    var _minDist = await Cia.drones[_selectedDrone].methods.calculateDistanceToPos(_position).call();
    var _status = document.getElementById("status");
    const _idDrone = await Cia.drones[_selectedDrone].methods.getId().call()
    _status.innerHTML = "(Distancia =" + _minDist + ")" +
      " -> Presupuestar <button onclick='App.sendDrone(" + _position + "," + _idDrone + ",\"" + _plotAddress + "\"," + _rowIndex +
      ",\"" + _owner + "\")' id='sendDroneBTN'> Dron " + _idDrone + "</button>";
  },

  nearestDrone: async function (_position) {
    var _selectedDrone = null;
    var _minDist = 0;
    for (var i = 0; i < Cia.drones.length; i++) {
      var result = await Cia.drones[i].methods.calculateDistanceToPos(_position).call();
      if ((_selectedDrone == null) || (result < _minDist)) {
        _minDist = result;
        _selectedDrone = i;
      }
    }
    return _selectedDrone;

  },

  sendDrone: async function (_position, _idDrone, _plotAddress, _rowIndex, _owner) {
    const _drone = await Cia.droneFactory.methods.getDrone(_idDrone).call();
    const _droneInstance = await new App.web3.eth.Contract(
      droneArtifact.abi,
      _drone,
    );
    const _distance = await _droneInstance.methods.calculateDistanceToPos(_position).call();
    const _bidValue = document.getElementById("bidValueTXT").value;
    //console.log(_bidValue + "---owner:"+_owner + "----plot:"+ _plotAddress + "---drone:"+_drone);
    console.log("----ciaAddress:" + App.web3.utils.toChecksumAddress(Cia.companyAddress));
    await Cia.landOwner.methods.bidWork(App.web3.utils.toChecksumAddress(_plotAddress),
      _bidValue, App.web3.utils.toChecksumAddress(_drone), App.web3.utils.toChecksumAddress(_owner),
      App.web3.utils.toChecksumAddress(Cia.companyAddress))
      .send({ from: App.web3.utils.toChecksumAddress(Cia.account), gas: 300000 })
      .on('error', (error) => {
        const _error = document.getElementById("statusCia");
        _error.innerHTML = "Transacción incorrecta";
      })
      .on('receipt', async (result) => {
        document.getElementById("worksTable").deleteRow(_rowIndex);
        document.getElementById("status").innerHTML = null;
        Cia.dronCoin.events.Approval(function (err, event) { console.log(event.returnValues); })
          .on('data', function (events) {
            //ACtivar botón de validación de trabajo //
            //_row.insertCell(6).innerHTML = "<button onclick='App.bidWork(\"" + _plotInstance.options.address + "\"," + _row.rowIndex + ", \"" + _owner + "\")' id='bidWorkBTN'>Pujar</button>";

            var _own = events.returnValues.owner;
            var _spender = events.returnValues.spender;
            var _amount = events.returnValues.value;
            //console.log("Aprobado:" + _amount + " desde : " + _own + " para: " + _spender);
            if (_spender == Cia.companyAddress) {
              //console.log("Esta compañia:" + Cia.companyAddress);
              //console.log("CompleteWork:[" + App.web3.utils.toChecksumAddress(_own) + "][" + App.web3.utils.toChecksumAddress(_plotAddress) + "]");
              Cia.landOwner.methods.completeWork(App.web3.utils.toChecksumAddress(_own),
                App.web3.utils.toChecksumAddress(_plotAddress), App.web3.utils.toChecksumAddress(_drone))
                .send({ from: App.web3.utils.toChecksumAddress(Cia.account), gas: 300000 })
                .on('error', (error) => {
                  console.log(error);
                  const _error = document.getElementById("statusCia");
                  _error.innerHTML = "Transacción incorrecta";
                })
                .on('receipt', (result) => {
                  if (_distance > 0) {
                    _droneInstance.methods.moveTo(_position).send({ from: Cia.account, gas: 300000 })
                      .on('error', console.error)
                      .on('receipt', async (result) => {
                        console.log(result);
                      });
                  } else {
                    console.log("Drone ya en posicion, solo fumiga");
                  }
                  Cia.dronCoin.methods.transferFrom(App.web3.utils.toChecksumAddress(_own),
                    App.web3.utils.toChecksumAddress(_spender), _bidValue)
                    .send({ from: App.web3.utils.toChecksumAddress(App.account), gas: 300000 });
                });
            }
          });

      });

  },

  searchPlot: async function (_selectedPlot) {
    var _plotInstance;
    _plotInstance = await new App.web3.eth.Contract(plotArtifact.abi, _selectedPlot);
    return _plotInstance;
  },

  showPlotObject: async function (_plotInstance, _row, _owner) {
    const _idPlot = await _plotInstance.methods.getId().call();
    const _surfacePlot = await _plotInstance.methods.getSurface().call();
    const _maxHPlot = await _plotInstance.methods.getMaxHeight().call();
    const _minHPlot = await _plotInstance.methods.getMinHeight().call();
    const _position = await _plotInstance.methods.getPos().call();
    const _selectedDrone = await Cia.nearestDrone(_position);;
    const plotIdElement = _row.insertCell(0);
    const plotSurfaceElement = _row.insertCell(1);
    const plotMaxElement = _row.insertCell(2);
    const plotMinElement = _row.insertCell(3);
    const _nearestDroneElement = _row.insertCell(4);
    const _distanceToPosElement = _row.insertCell(5);
    plotIdElement.innerHTML = _idPlot;
    plotSurfaceElement.innerHTML = _surfacePlot;
    plotMaxElement.innerHTML = _maxHPlot;
    plotMinElement.innerHTML = _minHPlot;
    _nearestDroneElement.innerHTML = await Cia.drones[_selectedDrone].methods.getId().call();
    _distanceToPosElement.innerHTML = await Cia.drones[_selectedDrone].methods.calculateDistanceToPos(_position).call();

    _row.insertCell(6).innerHTML = "<button onclick='App.bidWork(\"" + _plotInstance.options.address + "\"," + _row.rowIndex + ", \"" + _owner + "\")' id='bidWorkBTN'>Pujar</button>";
  },


  createNewCompany: async function (_name) {
    var fumigationCO = await new Cia.web3.eth.Contract(fumigationCOArtifact.abi);
    var fumigationCOInstance;
    fumigationCO.options.data = fumigationCOArtifact.bytecode;
    let code = fumigationCOArtifact.bytecode;
    await fumigationCO.deploy({
      data: code,
      arguments: [_name]
    }).send({ from: Cia.account, gas: 1000000 }).then((instance) => { fumigationCOInstance = instance });
    Cia.companyAddress = fumigationCOInstance.options.address;
    Cia.showDrones(Cia.companyAddress);
    Cia.showWorks();
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

  deployCompany: async function (_addressCo) {
    var _instanceCO = await Cia.deployExistingCompany(_addressCo);
    document.getElementsByClassName("nombreCO")[0].innerHTML = await _instanceCO.methods.getName().call();
    document.getElementById("generateCOBTN").disabled = true;
    document.getElementById("saldoCO").innerHTML = await Cia.dronCoin.methods.balanceOf(_addressCo).call();
    Cia.showDrones(Cia.companyAddress);
    Cia.showWorks();
  },


  deployCO: async function () {
    const _addressCo = document.getElementById("addressCO").value;
    this.deployCompany(_addressCo);
  },

  generateCO: async function () {
    const _nameCO = document.getElementById("nameCO").value;
    var _addrCO = await Cia.createNewCompany(_nameCO);
    console.log("Generated company:" + _addrCO);
    document.getElementsByClassName("nombreCO")[0].innerHTML = _nameCO;
    document.getElementById("generateCOBTN").disabled = true;
    Cia.dronCoin.methods.balanceOf(_addrCO).call().then((result) => {
      console.log("===============>" + result);
    });
  },


  showDrones: async function (_owner) {
    const { getDronesOwner } = Cia.droneFactory.methods;
    var _drones = [];
    Cia.drones = [];
    console.log("Drones:" + _owner);
    _drones = await getDronesOwner(_owner).call();
    document.getElementById("numberDrones").innerHTML = _drones.length;
    const _dronesList = document.getElementById("dronesList");

    var _length = _dronesList.options.length;
    for (var i = 0; i < _length; i++) {
      _dronesList.remove(0);
    }

    _drones.forEach(async function (_dr, index) {
      const _drone = await Cia.droneFactory.methods.getDrone(_dr).call();
      const _droneInstance = await new App.web3.eth.Contract(
        droneArtifact.abi,
        _drone,
      );
      const _text = await _droneInstance.methods.getId().call() + "->" + await _droneInstance.methods.getRange().call() + "-" + await _droneInstance.methods.getCurrentPos().call();
      Cia.drones.push(_droneInstance);
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

window.ethereum.on('accountsChanged', async function (accounts) {
  Cia.account = window.ethereum.selectedAddress;
  console.log("Cia.account:" + Cia.account);
});

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
