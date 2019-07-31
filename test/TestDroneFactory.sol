pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
//import "../contracts/Dron.sol";
import "../contracts/DroneFactory.sol";

contract TestDroneFactory {

    DroneFactory df ;

    function beforeAll() public {
        df = DroneFactory(DeployedAddresses.DroneFactory());
    }

    function testInitialStock() public {
        DroneFactory factory = DroneFactory(DeployedAddresses.DroneFactory());
        Assert.equal(uint(factory.getStock()),uint(10),"Factoria desplegada sin stock");
        Assert.equal(uint(df.getStock()),uint(10),"Factoria desplegada sin stock");
    }
/*
    function testBuyDrone () public {
        Drone newDron = Drone(df.buyDrone());
        
        Assert.isNotZero(uint(df.getStock()),"Not enough stock");
    }

    function testMultipleDrones () public {
        Drone newDron;
        for (uint i = df.getStock();i>0;i--) {
            newDron = df.buyDrone();
        }
        Assert.isNotZero(newDron.getId(),"Not enough stock");
    }*/

}