pragma solidity >=0.4.25 <0.6.0;

contract Drone {
    uint256 private id;
    uint128 private maxHeight;
    uint128 private minHeight;
    uint128 private range;
    uint256 private fabricationCost;
    bool[5] public pestList;
    uint private currentPlot;

    constructor (uint256 _id) public {
        id = _id;
        fabricationCost = 100;
        maxHeight = 100;
        minHeight = 10;
        range = 100;
        currentPlot = 1;
    }

    function initialize (uint128 _maxHeight,uint128 _minHeight,uint128 _range) public {
        fabricationCost = 100;
        maxHeight = _maxHeight;
        minHeight = _minHeight;
        range = _range;
    }

    function getId() public view returns(uint256)  {
        return id;
    }

    function getMaxHeight() public view returns(uint128) {
        return maxHeight;
    }

    function getMinHeight() public view returns(uint128) {
        return minHeight;
    }

    function getRange() public view returns(uint128) {
        return range;
    }

    function validPest(uint _pest) public view returns (bool) {
        return pestList[_pest];
    }

    function addPest(uint _pest) public {
        pestList[_pest] = true;
    }

    function removePest(uint _pest) public {
        pestList[_pest] = false;
    }

    function getCurrentPlot() public view returns (uint) {
        return currentPlot;
    }

}
