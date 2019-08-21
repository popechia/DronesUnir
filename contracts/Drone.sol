pragma solidity >=0.4.25 <0.6.0;

contract Drone {
    uint constant private INIT_POS = 1;
    uint256 private id;
    uint128 private maxHeight;
    uint128 private minHeight;
    uint256 private range;
    uint256 private fabricationCost;
    uint256 private travelCost;
    bool[5] public pestList;
    uint private currentPos;

    constructor (uint256 _id) public {
        id = _id;
        fabricationCost = 100;
        maxHeight = 100;
        minHeight = 10;
        range = 100;
        currentPos = INIT_POS;
        travelCost = 1;
    }

    function initialize (uint128 _maxHeight,uint128 _minHeight,uint128 _range) public {
        require (_maxHeight >= _minHeight,"MaxHeight less than minHeight");
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

    function getRange() public view returns(uint256) {
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

    function getCurrentPos() public view returns (uint) {
        return currentPos;
    }

    function moveTo(uint _newPos) public {
        uint _distance = calculateDistanceToPos(_newPos);
        require (range > _distance,"Not enough range");
        currentPos = _newPos;
        require (range > (_distance + calculateDistanceToPos(INIT_POS)),"Insufficient autonomy to return");
        range = range - calculateDistanceToPos(_newPos);
    }

    function calculateDistanceToPos(uint _posTo) public view returns (uint) {
        if (currentPos < _posTo) return (_posTo - currentPos);
        return (currentPos - _posTo);
    }

    function calculateCostToPos(uint _posTo) public view returns (uint) {
        return calculateDistanceToPos(_posTo)*travelCost;
    }


    function getMetadata() public view returns (bytes memory _metadata) {
        _metadata = abi.encodePacked(id,fabricationCost,maxHeight,minHeight,range,currentPos);
    }

}
