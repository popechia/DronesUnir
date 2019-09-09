const LandOwner = artifacts.require("LandOwner");

contract("Testing Land Owner", async accounts => {

    let _register;
    let _addressMOCK = "0x0000000000000000000000000000000000000000";
    let _addressMOCK2 = "0x9C6463E61acf6FEAc853b59Df41ceD9937eB20f4";

    beforeEach(async () => {
        _register = await LandOwner.new();
        let resultTX = await _register.publishWork(_addressMOCK);
        truffleAssert.eventEmitted(resultTX, "WorkPublished", (ev) => {
            _sender = ev._owner;
            _plot = ev._plot;
            return _plot == _addressMOCK;
        });
    });

    afterEach(async () => {
    });
/*
    it("Validate publish work", async () => {
        let resultTX = await _register.publishWork(_addressMOCK);
        truffleAssert.eventEmitted(resultTX, "WorkPublished", (ev) => {
            _sender = ev._owner;
            _plot = ev._plot;
            return _plot == _addressMOCK;
        });
    });*/

    it("Duplicated work drone unauthorized", async () => {
        await truffleAssert.reverts(_register.publishWork(_addressMOCK),"Work already published");
    });

    it("Validate complete work", async () => {
        let resultTX = await _register.completeWork(_addressMOCK,_addressMOCK);
        truffleAssert.eventEmitted(resultTX, "WorkFinished", (ev) => {
            _sender = ev._owner;
            _plot = ev._plot;
            _drone = ev._drone;
            return _plot == _addressMOCK;
        });
    });


    it("Complete work unpublished", async () => {
        await truffleAssert.reverts(_register.completeWork(_addressMOCK2,_addressMOCK),"Work not published");
    });

});
