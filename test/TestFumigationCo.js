const FumigationCO = artifacts.require("FumigationCO");
const DroneERC721 = artifacts.require("DroneERC721");
const truffleAssert = require("truffle-assertions");

contract("Testing FumigationCO", async accounts => {

    let _company1;
    let _droneId;
    const PEST_NITRATO = 1;
    const _plot2 = 3;

    beforeEach(async () => {
        _company1 = await FumigationCO.new("Fumigation1");
        droneFactory = await DroneERC721.new();
        let resultTX = await droneFactory.buildDrone(_company1.address);
        truffleAssert.eventEmitted(resultTX, "Transfer", (ev) => {
            _droneId = ev.tokenId;
            _company1.registerDrone(ev.tokenId);
            return ev.to == _company1.address;
        });
    });

    afterEach(async () => {
    });

    it("Validate name", async () => {
        let _name = await _company1.getName();
        assert.equal(_name, "Fumigation1", "Name not valid");
    });

    it("Associate duplicated drone", async () => {
        await truffleAssert.reverts(_company1.registerDrone(_droneId),"Drone already registered");
    });

    it("Unregister drone", async () => {
        await truffleAssert.reverts(_company1.unregisterDrone(0));
    });

    it("Unregister invalid drone", async () => {
        let _total = await _company1.getTotalDrones();
        await _company1.unregisterDrone(_droneId);
        assert.equal (_total.toNumber()-1, (await _company1.getTotalDrones()).toNumber(),"incorrect");
    });   

    it("Transfer drone", async () => {
        let _company2 = await FumigationCO.new("Fumigation2");
    } );



});
