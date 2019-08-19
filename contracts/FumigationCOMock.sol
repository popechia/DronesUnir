pragma solidity >=0.4.25 <0.6.0;

import "./FumigationCO.sol";

contract FumigationCOMock is FumigationCO {
    constructor(string memory _name) public FumigationCO(_name) {
    }
}