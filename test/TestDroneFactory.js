const DroneFactory = artifacts.require("DroneFactory");
const truffleAssert = require("truffle-assertions");

contract("DroneFactory", async accounts => {
 /* let df;
  let price = 10;

  beforeEach(async () => {
    df = await DroneFactory.new({ from: accounts[0] });
    stock = await df.getStock.call({ from: accounts[0] });
    assert.equal(
      stock.valueOf(),
      10,
      "10 wasn't in the stock"
    );
  });

  afterEach(async () => {
    df.destroyFactory();
  });

  async function buyAll() {
    let stock = await df.getStock();
    for (i = 0; i < stock; i++) {
      let newDrone = await df.buyDrone({ from: accounts[1], value: price });
      assert.isOk(newDrone, "No valid drone");
    }
    stock = await df.getStock();
    assert.equal(stock.toNumber(), 0, "Failed stock update");
  };

  it("Buy a drone", async () => {
    let stockPrev = await df.getStock();
    let newDrone = await df.buyDrone({ from: accounts[1], value: price });
    let stockPost = await df.getStock();
    assert.isOk(newDrone, "No valid drone");
    assert.equal(stockPrev.toNumber(), stockPost.toNumber() + 1, "Failed stock update");
  });

  it("Buy a drone, insufficient value", async () => {
    await truffleAssert.reverts(df.buyDrone({ from: accounts[1], value: 1 }),"Insufficient value");
  });

  it("Buy all drones", async () => {
    let newDrone = await df.buyDrone({ from: accounts[1] , value: price });
    let stock = await df.getStock();
    for (i = 0; i < stock; i++) {
      let stockPrev = await df.getStock();
      let newDrone = await df.buyDrone({ from: accounts[1], value: price  });
      let stockPost = await df.getStock();
      assert.isOk(newDrone, "No valid drone");
      assert.equal(stockPrev.toNumber(), stockPost.toNumber() + 1, "Failed stock update");
    }
    stock = await df.getStock();
    assert.equal(stock.toNumber(), 0, "Failed stock update");
  });

  it("Buy drone without stock", async () => {
    await buyAll();
    await truffleAssert.reverts(df.buyDrone({ from: accounts[1] , value: price  }), "Without Stock");
  });

  it("Reserve drone without stock", async () => {
    await buyAll();
    let resultTX = await df.reserveDrone({ from: accounts[1] });
    await truffleAssert.eventEmitted(resultTX, "droneReserved", (ev) => {
      return ev.owner == accounts[1];
    });
  });

  it("Reserve drone with stock", async () => {
    let resultTX = await df.reserveDrone({ from: accounts[1] });
    await truffleAssert.eventEmitted(resultTX, "stockAvaliable");
  });
  
  it("Destruct no owner", async () => {
    await truffleAssert.reverts(df.destroyFactory({ from: accounts[1] }), "Only owner");
  });
*/

});
