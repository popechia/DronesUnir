pragma solidity >=0.4.21 <0.6.0;

contract RegProp {
    struct Plot {
        uint id;
        uint surface;
    }

//    mapping(address => uint[]) private plotsByOwner;
    address[] private plotsIds;
    mapping(uint => Plot) private plotsStock;
    mapping (address => uint256) ownershipPlotsCount;
    uint idIndex;
    uint128 constant PLOT_NUMBER= 10;
    event plotTransfer(address from, address to, uint256 plotId);

    constructor () public {
        //Cargamos la pos(0) del array a la address(0) para evitar problemas de indice
        plotsIds.push(address(0));
        for (int i = 0;i<PLOT_NUMBER;i++) {
            createPlot(10,msg.sender);
        }
    }

    function getTotalPlots() public view returns(uint)  {
        return plotsIds.length;
    }

    function createPlot(uint _surface, address _owner) internal returns(uint) {
        idIndex = plotsIds.push(_owner)-1;
        Plot memory _plot = Plot ({
            id: idIndex,
            surface: _surface
        });
        //plotsByOwner[_owner].push(idIndex);
        plotsStock[idIndex] = _plot;
        ownershipPlotsCount[_owner]++;
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

    function getPlotsOwner(address _owner) public view returns (uint[] memory) {
        uint plotCount = ownershipPlotsCount[_owner];
        uint[] memory plots = new uint[](plotCount);
        uint j = 0;
        for (uint i = 0;i<plotsIds.length;i++) {
            if (plotsIds[i] == _owner) {
                plots[j++] = i;
            }
        }
        //plots = plotsByOwner[owner];
        return plots;
    }
}