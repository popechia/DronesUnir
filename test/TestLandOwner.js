const LandOwner = artifacts.require("LandOwner");

contract("Testing Land Owner", async accounts => {

    let _register;
    let _addressMOCK = "0x0000000000000000000000000000000000000000";

    beforeEach(async () => {
        _register = await LandOwner.new();
    });

    afterEach(async () => {
    });

    it("Validate publish work", async () => {
        let resultTX = await _register.publishWork(_addressMOCK);
        truffleAssert.eventEmitted(resultTX, "WorkPublished", (ev) => {
            _sender = ev._owner;
            _plot  = ev._plot;
            return _plot == _addressMOCK;
        });
    });

});
