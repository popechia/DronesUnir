pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract RegProp is Ownable {
//    mapping(address => uint[]) private plotsByOwner;
    address[] private plotsIds;
    mapping(uint256 => address) private plotsStock;
    mapping (address => uint256) ownershipPlotsCount;
    uint256 idIndex;
    uint128 constant PLOT_NUMBER= 10;
    event plotTransfer(address from, address to, uint256 plotId);
    event plotRegistered(address to,uint256 plotId);

    constructor () public {
        //Cargamos la pos(0) del array a la address(0) para evitar problemas de indice
        plotsIds.push(address(0));
        /*for (int i = 0;i<PLOT_NUMBER;i++) {
            createPlot(10,msg.sender);
        }*/
    }

    function getTotalPlots() public view returns(uint)  {
        return plotsIds.length;
    }

    function createPlot(address _plot, address _owner) public onlyOwner returns(uint256) {
        idIndex = plotsIds.push(_owner)-1;
        plotsStock[idIndex] = _plot;
        ownershipPlotsCount[_owner]++;
        emit plotRegistered(_owner,idIndex);
        return idIndex;
    }

    function transfer(address _from, address _to, uint256 _plotId) public/*internal*/ {
        // transfer ownership
        require (_from == plotsIds[_plotId],"Only owner");
        plotsIds[_plotId] = _to;
        ownershipPlotsCount[_from]--;
        ownershipPlotsCount[_to]++;
        // Emit the transfer event.
        emit plotTransfer(_from, _to, _plotId);
    }

    function getPlotsOwner(address _owner) public view returns (uint256[] memory) {
        uint256 plotCount = ownershipPlotsCount[_owner];
        uint256[] memory plots = new uint[](plotCount);
        uint256 j = 0;
        for (uint256 i = 0;i<plotsIds.length;i++) {
            if (plotsIds[i] == _owner) {
                plots[j++] = i;
            }
        }
        return plots;
    }

    function getPlot (uint256 _idPlot) public view returns (address) {
        require (_idPlot <= idIndex,"Invalid plot ID");
        return plotsStock[_idPlot];
    }

    function destroyFactory() public onlyOwner {
        selfdestruct(msg.sender);
    }

}