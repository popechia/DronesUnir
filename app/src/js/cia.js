import Web3 from "web3";
import droneERC721Artifact from "../../../build/contracts/DroneERC721.json";
import fumigationCOArtifact from "../../../build/contracts/FumigationCO.json";

const Cia = {
  web3: null,
  account: null,
  accountOrigin: null,
  droneFactory: null,
  drone: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      //console.log("==>" + networkId);
      //const accounts = await web3.eth.getAccounts();
      this.account = window.ethereum.selectedAddress;
      this.accountOrigin = window.ethereum.selectedAddress;
      
      const deployedNetwork = droneERC721Artifact.networks[networkId];
      this.droneFactory = await new web3.eth.Contract(
        droneERC721Artifact.abi,
        deployedNetwork.address,
      );
      console.log("DroneFactory address:"+this.droneFactory.options.address);

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
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
    return fumigationCOInstance.options.address;
  },

  deployExistingCompany: async function (_address) {    
    var fumigationCOInstance = new Cia.web3.eth.Contract(
      fumigationCOArtifact.abi,
      _address,
    );
    return fumigationCOInstance;
  },
//0xCBc9f621CF0cc62AB44FE60aB9ba1AD87a21aedF
  deployCO: async function () {
    const _addressCo = document.getElementById("addressCO").value;
    var _instanceCO = await Cia.deployExistingCompany(_addressCo);
    document.getElementsByClassName("nombreCO")[0].innerHTML = await _instanceCO.methods.getName().call();
    document.getElementById("generateCOBTN").disabled = true;
  },

  generateCO: async function () {
    const _nameCO = document.getElementById("nameCO").value;
    var _addrCO = await Cia.createNewCompany(_nameCO);
    document.getElementsByClassName("nombreCO")[0].innerHTML = _nameCO;
    document.getElementById("generateCOBTN").disabled = true;
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
