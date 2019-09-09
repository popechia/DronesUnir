pragma solidity >=0.4.25 <0.6.0;

contract LandOwner {
    mapping (address => mapping (address => uint)) public publishedWork;
    mapping (address => mapping (address => uint)) public finishedWork;
    address[] public plotsPublished;

    event WorkPublished (address _owner ,address _plot, uint _timestamp);
    event WorkFinished (address _owner ,address _plot, uint _timestamp, address _drone);

    function publishWork(address _plotId) public  {
        require (publishedWork[msg.sender][_plotId] == 0,"Work already published");
        //publishedWork[msg.sender][_plotId] = now;
        plotsPublished.push(_plotId);
        emit WorkPublished (msg.sender, _plotId, now);
    }

    function completeWork(address _plotId,address _droneId) public {
        //require (publishedWork[msg.sender][_plotId] != 0,"Work not published");
        publishedWork[msg.sender][_plotId] = 0;
        finishedWork[msg.sender][_plotId] = now;
        emit WorkFinished (msg.sender, _plotId, now,_droneId);
    }
    function getPlots () public view returns (address[] memory) {
        return plotsPublished;
    }
}