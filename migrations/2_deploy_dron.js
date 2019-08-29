const Drone = artifacts.require("./Drone.sol");
const Plot = artifacts.require("./Plot.sol");
const Crop = artifacts.require("./Crop.sol");
const DroneFactory = artifacts.require("./DroneFactory.sol");
const RegProp = artifacts.require("./RegProp.sol");
const DroneERC721 = artifacts.require("./DroneERC721.sol");
const FumigationCO = artifacts.require("./FumigationCO.sol");
//const FumigationCOMock = artifacts.require("./FumigationCOMock.sol");

module.exports = function (deployer) {
  deployer.deploy(DroneFactory);
  deployer.deploy(Drone, 1);
  deployer.deploy(RegProp,"Registro de A Coruña");
  deployer.deploy(Plot, 1);
  deployer.deploy(DroneERC721);
  deployer.deploy(FumigationCO,"FumigationCo1");
  //deployer.deploy(FumigationCOMock,"aa");
  deployer.deploy(Crop, "millo");
};
