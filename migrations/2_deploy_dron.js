const Drone = artifacts.require("./Drone.sol");
const DroneFactory = artifacts.require("./DroneFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(DroneFactory);
  deployer.deploy(Drone,1);
};
