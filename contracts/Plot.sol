pragma solidity >=0.4.25 <0.6.0;

contract Plot {
    uint private surface;
    uint private id;
    string private name;
    uint private maxHeight;
    uint private minHeight;
    uint private pos;

    function initialize (uint _surface,uint _max,uint _min,uint _pos) public {
        require(_max >= _min,"MaxHeight less than minHeight");
        surface = _surface;
        maxHeight = _max;
        minHeight = _min;
        pos = _pos;
    }

    function setId(uint _id) public {
        id = _id;
    }

    function getId() public view returns(uint) {
        return id;
    }

    function getPos() public view returns(uint) {
        return pos;
    }

    function setName(string memory _nm) public {
        name = _nm;
    }

    function getName() public view returns (string memory) {
        return name;
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