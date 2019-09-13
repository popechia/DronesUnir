pragma solidity >=0.4.25 <0.6.0;

contract LandOwner {
    mapping (address => mapping (address => uint)) public publishedWork;
    mapping (address => mapping (address => uint)) public bidedWork;
    mapping (address => mapping (address => uint)) public finishedWork;
    address[] public plotsPublished;

    event WorkPublished (address _owner ,address _plot, uint _timestamp);
    event WorkFinished (address _owner ,address _plot, uint _timestamp, address _drone);
    event WorkBided (address _owner,address _plot,uint _timestamp,uint256 _amount,address _drone); //_owner del drone en este caso

    function publishWork(address _plotId) public  {
        require (publishedWork[msg.sender][_plotId] == 0,"Work already published");
        publishedWork[msg.sender][_plotId] = now;
        plotsPublished.push(_plotId);
        emit WorkPublished (msg.sender, _plotId, now);
    }

    function bidWork(address _plot,uint256 _amount, address _drone,address _owner,address _bidder) public {
        require (publishedWork[_owner][_plot] != 0,"Work not published");
        bidedWork[_bidder][_plot] = _amount;
        emit WorkBided (_bidder,_plot,now,_amount,_drone);
    }

    function completeWork(address _owner,address _plotId,address _droneId) public {
        require (publishedWork[_owner][_plotId] != 0,"Work not published");
        publishedWork[_owner][_plotId] = 0;
        finishedWork[_owner][_plotId] = now;
        bidedWork[msg.sender][_plotId] = 0;
        emit WorkFinished (_owner, _plotId, now,_droneId);
    }

   // function getPlots () public view returns (address[] memory) {
   //     return plotsPublished;
   // }
}