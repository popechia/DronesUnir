const DroneERC721 = artifacts.require("DroneERC721");
const Drone = artifacts.require("Drone");
const truffleAssert = require("truffle-assertions");

contract("Testing DroneERC721", async accounts => {

  let droneFactory; 

  beforeEach(async () => {
    droneFactory = await DroneERC721.new({ from: accounts[0] });
  });

  afterEach(async () => {
  });

  it("Get drone not found", async () => {
    await truffleAssert.reverts(droneFactory.getDrone(0));    
  });

  it("Build a drone", async () => {
    let _droneId;
    let resultTX = await droneFactory.buildDrone(accounts[1]);
    truffleAssert.eventEmitted(resultTX, "Transfer", (ev) => {
      _droneId = ev.tokenId;
      return ev.to == accounts[1];
    });    
    let _drone = await droneFactory.getDrone(_droneId.toNumber());
    assert.isOk(_drone,"Drone not found");
  });

  it ("Balance 0", async () => {
    let _balance = await droneFactory.balanceOf(accounts[1]);    
    assert.equal(_balance.toNumber(), 0, "Incorrect balance");
  });

});
