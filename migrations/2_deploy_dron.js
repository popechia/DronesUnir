const Drone = artifacts.require("./Drone.sol");
const Plot = artifacts.require("./Plot.sol");
const Crop = artifacts.require("./Crop.sol");
const Constants = artifacts.require("../libraries/Constants.sol");
const DroneFactory = artifacts.require("./DroneFactory.sol");
const RegProp = artifacts.require("./RegProp.sol");
const DroneERC721 = artifacts.require("./DroneERC721.sol");

module.exports = function (deployer) {
  deployer.deploy(DroneFactory);
  deployer.deploy(Drone, 1);
  deployer.deploy(RegProp);
  deployer.deploy(Plot, 1);
  deployer.deploy(DroneERC721);
  deployer.deploy(Constants).then(() => {
    deployer.deploy(Crop, "millo");
  });
  deployer.link(Constants,Crop);
};
