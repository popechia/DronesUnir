const Drone = artifacts.require("Drone");
const truffleAssert = require("truffle-assertions");

contract("Drone", async accounts => {
    let drone1;
    let drone2;
    let price = 10;

    beforeEach(async () => {
        drone1 = await Drone.new(1);
        await drone1.initialize(100, 10, 1000);
        drone2 = await Drone.new(2);
        await drone2.initialize(100, 10, 1000);
    });

    afterEach(async () => {
    });

    it("Validate Id", async () => {
        assert.equal(await drone1.getId(), 1, "Invalid id");
    });

    it("Different drones, different ids", async () => {
        assert.notEqual(await drone1.getId(), await drone2.getId(), "Ids invalid");
    });

    it("Max Height", async () => {
        let height = await drone1.getMaxHeight();
        assert.isAtLeast(height.toNumber(), 0, "Max Height less than 0");
    });

    it("Min Height", async () => {
        let height = await drone1.getMinHeight();
        assert.isAtLeast(height.toNumber(), 0, "Min Height less than 0");
    });

    it("Max Height at least min height", async () => {
        let height1 = await drone1.getMaxHeight();
        let height2 = await drone1.getMinHeight();
        assert.isAtLeast(height1.toNumber(), height2.toNumber(), "Max Height less than Min");
    });
    it("Max Height less than min : reverted", async () => {
        await truffleAssert.reverts(drone2.initialize(1, 10, 10), "MaxHeight less than minHeight");
    });

    it("Range", async () => {
        let range = await drone1.getRange();
        assert.isAtLeast(range.toNumber(), 0, "Range less than 0");
    });

    it("Add pesticide", async () => {
        await drone1.addPest(0);
        assert.isTrue(await drone1.validPest(0),"PestA not assigned")
    });

    it("remove pesticide", async () => {
        await drone1.removePest(0);
        assert.isFalse(await drone1.validPest(0),"PestA not assigned")
    });

    it("Initial current plot equal 1", async () => {
        let currentPlot = await drone1.getCurrentPos();
        assert.equal(currentPlot.toNumber(),1,"Invalid initial Plot");
    });
    it("Move to pos", async () => {
        assert.equal(await drone1.getCurrentPos(),1,"Invalid position");
        await drone1.moveTo(3);
        assert.equal(await drone1.getCurrentPos(),3,"Invalid position");
    });
    it("Move too far away", async () => {
        await drone2.initialize (10,1,10);
        await truffleAssert.reverts(drone2.moveTo(100), "Not enough range");
    });

    it("Move too far away to return", async () => {
        await drone2.initialize (10,1,10);
        await truffleAssert.reverts(drone2.moveTo(6), "Insufficient autonomy to return");
        let currentPlot = await drone2.getCurrentPos();
        assert.equal(currentPlot.toNumber(),1,"Invalid Plot");
    });

    it("Calculate distance to pos", async () => {
        assert.equal(await drone1.getCurrentPos(),1,"Invalid position");
        let _distance = await drone1.calculateDistanceToPos(3);
        assert.equal(_distance.toNumber(),2,"Calculated distance incorrect");
    });

    it("Calculate cost to pos", async () => {
        assert.equal(await drone1.getCurrentPos(),1,"Invalid position");
        let _cost = await drone1.calculateCostToPos(3);
        assert.equal(_cost.toNumber(),2,"Calculated cost incorrect");
    });
});
