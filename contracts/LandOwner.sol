pragma solidity >=0.4.25 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";

contract LandOwner is IERC721Receiver {
    event WorkPublished (address _owner , uint256 _plot);

    function publishWork(uint256 _plotId) public  {
        emit WorkPublished (msg.sender, _plotId);
    }
}