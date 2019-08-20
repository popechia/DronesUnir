const Plot = artifacts.require("Plot");
const truffleAssert = require("truffle-assertions");

contract("Plot", async accounts => {
    let plot;

    beforeEach(async () => {
        plot = await Plot.new();
        await plot.initialize(100, 1000, 10);
    });

    afterEach(async () => {
    });
/*
    it("Validate Id", async () => {
        assert.equal(await plot.getId(), 1, "Invalid id");
    });
*/
    it("Validate surface", async () => {
        assert.equal(await plot.getSurface(), 100, "Invalid surface");
    });
    /*
        it("Different drones, different ids", async () => {
            assert.notEqual(await drone1.getId(), await drone2.getId(), "Ids invalid");
        });
    */
    it("Max Height", async () => {
        let height = await plot.getMaxHeight();
        assert.isAtLeast(height.toNumber(), 0, "Max Height less than 0");
    });

    it("Min Height", async () => {
        let height = await plot.getMinHeight();
        assert.isAtLeast(height.toNumber(), 0, "Min Height less than 0");
    });

    /*it("Max Height at least min height", async () => {
        let height1 = await drone1.getMaxHeight();
        let height2 = await drone1.getMinHeight();
        assert.isAtLeast(height1.toNumber(), height2.toNumber(), "Max Height less than Min");
    });
    */
    it("MaxHeight negative: reverted", async () => {
        await truffleAssert.reverts(plot.initialize(10, 1, 10), "MaxHeight less than minHeight");
    });

    /*
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
        let currentPlot = await drone1.getCurrentPlot();
        assert.equal(currentPlot.toNumber(),1,"Invalid initial Plot");
    });*/
});
