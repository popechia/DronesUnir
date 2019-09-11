pragma solidity >=0.4.25 <0.6.0;

import "../contracts/DronCoin.sol";

contract TestDronCoin {

    DronCoin coin;

    function beforeAll () public {
        coin = new DronCoin("DronCoin","DRCN",16,100000);
    }

}