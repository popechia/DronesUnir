pragma solidity >=0.4.25 <0.6.0;

import {Constants} from  "libraries/Constants.sol";

contract Crop {
    string private name;
    bool[3] admittedPests;

    constructor (string memory _name) public {
        name = _name;
    }

    function getName() public view returns(string memory) {
        //admittedPests[uint(Constants.PEST_LIST.NITRATO)] = true;
        return name;
    }

    function addPest(uint _pest) public {
        admittedPests[_pest] = true;
    }

    function removePest(uint _pest) public {
        admittedPests[_pest] = false;
    }

    function pestAdmitted(uint _pest) public view returns(bool) {
        return admittedPests[_pest];
    }

    function getNitrato() public pure returns (uint) {
        return uint(Constants.PEST.NITRATO);
    }
}