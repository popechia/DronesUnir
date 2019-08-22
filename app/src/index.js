import Web3 from "web3";
import regPropArtifact from "../../build/contracts/RegProp.json";

const App = {
  web3: null,
  account: null,
  regProp: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = regPropArtifact.networks[networkId];
      this.regProp = new web3.eth.Contract(
        regPropArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.getCuentas();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  getCuentas: async function() {
    const { getTotalPlots } = this.regProp.methods;
    const balance = await getTotalPlots().call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },
};

window.App = App;

window.addEventListener("load", function() {
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
