pragma solidity >=0.4.25 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/drafts/Counters.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";

contract FumigationCO is IERC721Receiver {
    string private name;
    mapping (uint256 => uint) dronesPlacement;
    using Counters for Counters.Counter;
    Counters.Counter private totalDrones;

    constructor(string memory _name) public {
        name = _name;
    }

    function getTotalDrones () public view returns (uint256) {
        return totalDrones.current();
    }

    function getName() public view returns(string memory) {
        return name;
    }
//Register drone in initial plot
    function registerDrone(uint256 _droneId) public {
        require(dronesPlacement[_droneId] == 0, "Drone already registered");
        dronesPlacement[_droneId] = 1;
        totalDrones.increment();
    }

    function unregisterDrone(uint256 _droneId) public {
        require(dronesPlacement[_droneId] != 0, "Drone not registered");
        dronesPlacement[_droneId] = 0;
        totalDrones.decrement();
    }
/*
    function registerOrder(uint256 _plot,uint PEST) public view {
        for (uint256 i = 0; i<totalDrones.current();i++) {
            //dronesPlacement[_d]
        }
    }*/
    /*
     * @return bytes4 `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
     */
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
    public returns (bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}