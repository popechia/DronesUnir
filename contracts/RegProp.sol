pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/drafts/Counters.sol";

contract RegProp is Ownable, ERC721Full {
    using Counters for Counters.Counter;
    Counters.Counter private _idIndex;
    mapping(uint256 => address) private plotsStock;
    event plotTransfer(address from, address to, uint256 plotId);
    event plotRegistered(address to,uint256 plotId);

    constructor () ERC721Full("Registro de la propiedad", "PROP") public {
    }

    function getTotalPlots() public view returns(uint)  {
        return _idIndex.current();
    }

    function createPlot(address _plot, address _owner) public onlyOwner returns (uint256) {
        _idIndex.increment();
        uint256 newItemId = _idIndex.current();
        _mint(_owner, newItemId);
        plotsStock[newItemId] = _plot;
        emit plotRegistered(_owner,newItemId);
        return newItemId;
    }

    function safeTransferFrom (address _from,address _to,uint256 _plotId) public {
        super.safeTransferFrom(_from,_to,_plotId);
        emit plotTransfer(_from,_to,_plotId);
    }

    function getPlotsOwner(address _owner) public view returns (uint256[] memory) {
        return _tokensOfOwner(_owner);
    }

    function getPlot (uint256 _idPlot) public view returns (address) {
        require (_idPlot <= _idIndex.current(),"Invalid plot ID");
        return plotsStock[_idPlot];
    }

    function destroyFactory() public onlyOwner {
        selfdestruct(msg.sender);
    }

}