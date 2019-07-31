pragma solidity >=0.4.25 <0.6.0;

contract Drone {
    uint256 private id;
    uint256 private fabricationCost;

    constructor(uint256 _id) public {
        id = _id;
        fabricationCost = 100;
    }

    function getId() public view returns(uint256)  {
        return id;
    }

}
