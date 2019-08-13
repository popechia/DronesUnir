pragma solidity >=0.4.25 <0.6.0;

contract Plot {
    uint private id;
    uint private surface;
    uint private maxHeight;
    uint private minHeight;

    constructor (uint _id) public {
        id = _id;
    }

    function initialize (uint _surface,uint _max,uint _min) public {
        require(_max >= _min,"MaxHeight less than minHeight");
        surface = _surface;
        maxHeight = _max;
        minHeight = _min;
    }

    function getId() public view returns(uint) {
        return id;
    }

    function getSurface() public view returns(uint) {
        return surface;
    }

    function getMaxHeight() public view returns(uint) {
        return maxHeight;
    }

    function getMinHeight() public view returns(uint) {
        return minHeight;
    }
}