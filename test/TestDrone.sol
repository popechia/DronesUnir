pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Drone.sol";

contract TestDrone {

    Drone dron1;
    Drone dron2;

    function beforeAll () public {
        dron1 = new Drone(1);
        dron2 = new Drone(2);
    }

    function testIdEqual1() public {
        Assert.equal(dron1.getId(),1,"Identificador distinto de 1");
    }

    function testIdsNotEqual() public {
        Assert.notEqual(dron1.getId(),dron2.getId(),"Identificadores iguales");
    }


}
