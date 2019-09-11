pragma solidity >=0.4.25 <0.6.0;

import "./Drone.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/drafts/Counters.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DroneERC721 is ERC721Full, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping( uint256 => address) drones;
    mapping( uint => mapping (address => uint)) movementAllowed;
    uint constant DRONE_PRICE = 10 wei;
    uint128 constant DRONE_MAXHEIGHT= 100;
    uint128 constant DRONE_MINHEIGHT = 10;
    uint128 constant DRONE_RANGE = 100;

    constructor() ERC721Full("DRONES", "DRN") public {
    }

    function buildDrone(address customer) public onlyOwner returns (uint256) {
        return buildDrone(customer,DRONE_MAXHEIGHT,DRONE_MINHEIGHT,DRONE_RANGE);
    }

    function buildDrone(address customer,uint128 _maxHeight,uint128 _minHeight,uint128 _range)
    public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        Drone newDrone = new Drone(newItemId);
        newDrone.initialize(_maxHeight,_minHeight,_range);
        _mint(customer, newItemId);
        _setTokenURI(newItemId, string(newDrone.getMetadata()));
        drones[newItemId] = address(newDrone);
        return newItemId;
    }

    function safeTransferFrom (address _customer1,address _customer2,uint256 _droneId) public {
        super.safeTransferFrom(_customer1,_customer2,_droneId);
    }

    function destroyDrone(uint256 _id) public {
        _burn(_id);
        drones[_id] = address(0);
    }

    function getDrone (uint256 _id) public view returns (Drone){
        require(drones[_id] != address(0), "Drone not found");
        return (Drone(drones[_id]));
    }

    function getDronesOwner(address _owner) public view returns (uint256[] memory) {
        return _tokensOfOwner(_owner);
    }
/*
    function allowWork (address _to, uint256 _id, uint _newPos) public {
        require (msg.sender == ownerOf(_id),"Only drone owner");
        movementAllowed[_id][_to] = _newPos;
    }

    function isAllowedToWok (address _to,uint256 _id, uint _newPos) public view returns (bool){
        return ((msg.sender == ownerOf(_id)) || (movementAllowed[_id][_to]==_newPos));
    }

    function sendDrone (uint256 _id, uint _pos) public {
        require (isAllowedToWok(msg.sender,_id,_pos),"Movement not allowed");
        Drone _drone = Drone(drones[_id]);
        movementAllowed[_id][msg.sender] = 0;
        _drone.moveTo(_pos);
    }
*/
    function destroyFactory() public onlyOwner {
        selfdestruct(msg.sender);
    }

}