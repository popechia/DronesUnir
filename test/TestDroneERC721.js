const DroneERC721 = artifacts.require("DroneERC721");
const FumigationCOMock = artifacts.require("FumigationCOMock");

const truffleAssert = require("truffle-assertions");

contract("Testing DroneERC721", async accounts => {

  let droneFactory; 
  let _droneId;
  let _customer1 = accounts[1];
  let _customer2 = accounts[0];

  beforeEach(async () => {
    droneFactory = await DroneERC721.new();
    let _pre = await droneFactory.balanceOf(_customer1);
    assert.equal(_pre.toNumber(),0,"Owned drones not 0");
    let resultTX = await droneFactory.buildDrone(_customer1);
    truffleAssert.eventEmitted(resultTX, "Transfer", (ev) => {
      _droneId = ev.tokenId;
      return ev.to == _customer1;
    });    
    let _post = await droneFactory.balanceOf(_customer1);
    assert.equal(_pre.toNumber()+1,_post.toNumber(),"Balance incorrect");
  });

  afterEach(async () => {
    droneFactory.destroyFactory();
  });

  it("Get drone not found", async () => {
    assert.equal(await droneFactory.getDronesOwner(_customer1),1,"Invalid number of drones");    
  });

  it("Get drones of owner", async () => {
    await truffleAssert.reverts(droneFactory.getDrone(0),"Drone not found");    
  });

  it("Transfer drone", async () => {
    let _balance = await droneFactory.balanceOf(_customer2);    
    assert.equal(_balance.toNumber(), 0, "Incorrect balance");
    await droneFactory.safeTransferFrom(_customer1,_customer2,_droneId,{from: _customer1});
    _balance = await droneFactory.balanceOf(_customer2);    
    assert.equal(_balance.toNumber(), 1, "Incorrect balance");
    assert.equal(await droneFactory.ownerOf(_droneId),_customer2,"Invalid ownership");
  });

  it("Transfer drone to a company", async () => {
    let _company = await FumigationCOMock.new("CO1",{from:_customer1});
    let _balance = await droneFactory.balanceOf(_company.address);    
    assert.equal(_balance.toNumber(), 0, "Incorrect balance");
    await droneFactory.safeTransferFrom(_customer1,_company.address,_droneId,{from: _customer1});
    _balance = await droneFactory.balanceOf(_company.address);    
    assert.equal(_balance.toNumber(), 1, "Incorrect balance");
    assert.equal(await droneFactory.ownerOf(_droneId),_company.address,"Invalid ownership");
  });

  it("Transfer drone unauthorized", async () => {
    await truffleAssert.reverts(droneFactory.safeTransferFrom(_customer1,_customer2,_droneId,{from: _customer2})/*,"ERC721: transfer caller is not owner nor approved"*/);
  });

  it("Transfer drone to invalid address", async () => {
    await truffleAssert.reverts(droneFactory.safeTransferFrom(_customer1,droneFactory.address,_droneId,{from: _customer1}),/*"ERC721: transfer caller is not owner nor approved"*/);
  });

  it("Build drone from invalid address", async () => {//_maxHeight,uint128 _minHeight,uint128 _range
    await truffleAssert.reverts(droneFactory.buildDrone(_customer1,100,1,10,{from:accounts[3]}),/*"ERC721: transfer caller is not owner nor approved"*/);
  });

  it("Build a drone", async () => {
    let _drone = await droneFactory.getDrone(_droneId.toNumber());
    assert.isOk(_drone,"Drone not found");
  });

  it ("Balance 0", async () => {
    let _balance = await droneFactory.balanceOf(_customer2);    
    assert.equal(_balance.toNumber(), 0, "Incorrect balance");
  });
  
  it ("Destroy drone", async () => {
    await droneFactory.destroyDrone(_droneId.toNumber());
    _balance = await droneFactory.balanceOf(_customer1);    
    assert.equal(_balance.toNumber(), 0, "Incorrect balance");
  });

});
