const Drone = artifacts.require("./Drone.sol");
const DroneFactory = artifacts.require("./DroneFactory.sol");
const RegProp = artifacts.require("./RegProp.sol");

module.exports = function(deployer) {
  deployer.deploy(DroneFactory);
  deployer.deploy(Drone,1);
  deployer.deploy(RegProp);
};
