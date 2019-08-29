pragma solidity >=0.4.25 <0.6.0;

import "./Drone.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/drafts/Counters.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DroneERC721 is ERC721Full, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping( uint256 => address) drones;
    uint constant DRONE_PRICE = 10 wei;
    uint128 constant DRONE_MAXHEIGHT= 100;
    uint128 constant DRONE_MINHEIGHT = 10;
    uint128 constant DRONE_RANGE = 100;
    uint128 constant DRONE_STOCK = 10;

    constructor() ERC721Full("DRONES", "DRN") public {
    }

    function buildDrone(address customer) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        Drone newDrone = new Drone(newItemId);
        newDrone.initialize(DRONE_MAXHEIGHT,DRONE_MINHEIGHT,DRONE_RANGE);
        _mint(customer, newItemId);
        _setTokenURI(newItemId, string(newDrone.getMetadata()));
        drones[newItemId] = address(newDrone);
        return newItemId;
    }

    function safeTransferFrom (address _customer1,address _customer2,uint256 _droneId) public {
        super.safeTransferFrom(_customer1,_customer2,_droneId);
    }

    function destroyDrone(uint256 _id) public {
        drones[_id] = address(0);
        _burn(_id);
    }

    function getDrone (uint256 _id) public view returns (Drone){
        require(drones[_id] != address(0), "Drone not found");
        return (Drone(drones[_id]));
    }

    function getDronesOwner(address _owner) public view returns (uint256[] memory) {
        return _tokensOfOwner(_owner);
    }

    function destroyFactory() public onlyOwner {
        selfdestruct(msg.sender);
    }

}