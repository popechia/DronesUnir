pragma solidity >=0.4.25 <0.6.0;

contract LandOwner {
    mapping (address => mapping (address => uint)) public publishedWork;
    mapping (address => address) public finishedWork;

    event WorkPublished (address _owner ,address _plot, uint _timestamp);

    function publishWork(address _plotId) public  {
        publishedWork[msg.sender][_plotId] = now;
        emit WorkPublished (msg.sender, _plotId, now);
    }
}