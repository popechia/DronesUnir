pragma solidity >=0.4.25 <0.6.0;

import {Constants} from  "libraries/Constants.sol";

contract Crop {
    string private name;
    bool[5] admittedPests;
    enum PEST_LIST {NITRATO,NITRITO,SULFITO}

    modifier validPest(uint _pest) {
        require (_pest<5, "Invalid Pest");
        _;
    }

    constructor (string memory _name) public {
        name = _name;
    }

    function getName() public view returns(string memory) {
        //admittedPests[uint(Constants.PEST_LIST.NITRATO)] = true;
        return name;
    }

    function addPest(uint _pest) public validPest(_pest) {
        admittedPests[_pest] = true;
    }

    function removePest(uint _pest) public validPest(_pest){
        admittedPests[_pest] = false;
    }

    function pestAdmitted(uint _pest) public view validPest(_pest) returns(bool) {
        return admittedPests[_pest];
    }

    function getNitrato() public pure returns (uint) {
        return uint(PEST_LIST.NITRATO);
    }

    function getNitrito() public pure returns (uint) {
        return uint(PEST_LIST.NITRITO);
    }
    function getSulfito() public pure returns (uint) {
        return uint(PEST_LIST.SULFITO);
    }

}