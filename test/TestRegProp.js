const RegProp = artifacts.require("RegProp");
const Plot = artifacts.require("PlotMock");
const truffleAssert = require("truffle-assertions");

contract("Property registration", async accounts => {

    let regProp;
    let accountOwner = accounts[0];
    let accountCreator = accounts[1];
    let accountNoOwner = accounts[2];
    let _idPlot;

    beforeEach(async () => {
        regProp = await RegProp.new("Prueba de registro",{ from: accountCreator });
        let _plot = await Plot.new();
        let resultTX = await regProp.createPlot(_plot.address, accountCreator, { from: accountCreator });
        await truffleAssert.eventEmitted(resultTX, "plotRegistered", (ev) => {
            _idPlot = ev.plotId;
            return ev.to == accountCreator;
        });
    });

    afterEach(async () => {
        regProp.destroyFactory({ from: accountCreator });
    });

    it("Validate Plots creation", async () => {
        let totalPlots = await regProp.getTotalPlots();
        assert.isAtLeast(totalPlots.toNumber(), 1, "No plots");
    });

    it("Get plots owner", async () => {
        let resultTX = await regProp.safeTransferFrom(accountCreator, accountOwner, 1, { from: accountCreator });
        let totalPlots = await regProp.getPlotsOwner(accountOwner);
        let totalPlots0 = await regProp.getPlotsOwner(accountCreator);
        assert.isAtLeast(totalPlots.length, 1, "No plots for owner");
        assert.equal(totalPlots0.length, 0, "No plots for owner");
        await truffleAssert.eventEmitted(resultTX, "plotTransfer", (ev) => {
            return ev.to == accountOwner && ev.from == accountCreator;
        });
    });

    it("Get No plots owner", async () => {
        let totalPlots = await regProp.getPlotsOwner(accountNoOwner);
        assert.equal(totalPlots.length, 0, "Plots for owner");
    });

    it("Transfer from no owner", async () => {
        await truffleAssert.reverts(regProp.safeTransferFrom(accountNoOwner, accountOwner, 1));
    });

    it("Transfer from no owner", async () => {
        await truffleAssert.reverts(regProp.safeTransferFrom(accountNoOwner, accountOwner, 1));
    });

    it("Get Plot by id", async () => {
        let _pl = await regProp.getPlot(_idPlot.toNumber());
        await assert.isOk(_pl, "Plot not found");
    });

    it("Get Plot by invalid id", async () => {
        await truffleAssert.reverts(regProp.getPlot(1000), "Invalid plot ID");
    });

    it("Validate owner", async () => {
        assert.equal(await regProp.ownerOf(_idPlot), accountCreator, "Owner incorrect");
    });
});