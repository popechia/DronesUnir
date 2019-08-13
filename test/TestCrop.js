const Crop = artifacts.require("Crop");
const Constants = artifacts.require("Constants");
//const truf

fleAssert = require("truffle-assertions");

contract("Crop", async accounts => {
    let crop;
    const _name = 'trigo';
    let _pest;
    //  const _pest = Constants.PEST_LIST.NITRITO;

    beforeEach(async () => {
        crop = await Crop.new(_name);
        _pest = (await crop.getNitrato()).toNumber(); 
    });

    afterEach(async () => {
    });

    it("Validate name", async () => {
        let _nm = await crop.getName();
        assert.equal(_nm, _name, "Invalid name");
    });

    it("Validate pest", async () => {
        await crop.addPest(_pest);
        assert(await crop.pestAdmitted(_pest),"Pest not admitted");
    });

    it("Remove pest", async () => {
        await crop.addPest(_pest);
        assert(await crop.pestAdmitted(_pest),"Pest not admitted");
        await crop.removePest(_pest);
        assert(!(await crop.pestAdmitted(_pest)) ,"Pest admitted");
    });
});
