const RegProp = artifacts.require("RegProp");
const truffleAssert = require("truffle-assertions");

contract("RegProp", async accounts => {

    let regProp; 

    beforeEach(async () => {
        regProp = await RegProp.new({ from: accounts[1] });
    });

    afterEach(async () => {
    });

    it("Validate Plots creation", async () => {
        let totalPlots = await regProp.getTotalPlots();
        assert.isAtLeast(totalPlots.toNumber(), 1, "No plots");
    });

    it("Get plots owner", async () => {
        let resultTX = await regProp.transfer(accounts[1],accounts[0],1);
        let totalPlots  = await regProp.getPlotsOwner(accounts[0]);
        let totalPlots0 = await regProp.getPlotsOwner(accounts[1]);
        assert.isAtLeast(totalPlots.length, 1, "No plots for owner");
        assert.equal(totalPlots0.length, 9, "No plots for owner");
        await truffleAssert.eventEmitted(resultTX, "plotTransfer", (ev) => {
            return ev.to == accounts[0] && ev.from == accounts[1];
          });
      
    });

    it("Get No plots owner", async () => {
        let totalPlots = await regProp.getPlotsOwner(accounts[2]);
        assert.equal(totalPlots.length, 0, "Plots for owner");
    }); 
    
    it("Transfer from no owner",async () => {
        await truffleAssert.reverts(regProp.transfer(accounts[2],accounts[0],1),"Only owner");
    });

    it("Transfer from no owner",async () => {
        await truffleAssert.reverts(regProp.transfer(accounts[2],accounts[0],1),"Only owner");
    });

});