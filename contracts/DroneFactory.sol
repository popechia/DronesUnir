pragma solidity >=0.4.25 <0.6.0;

import "./Drone.sol";

contract DroneFactory {
    // Mapping que servirá para llevar referencia de a que empresas se ha vendido qué drones
  /*  uint constant DRONE_PRICE = 10 wei;
    uint128 constant DRONE_MAXHEIGHT= 100;
    uint128 constant DRONE_MINHEIGHT = 10;
    uint128 constant DRONE_RANGE = 100;
    uint128 constant DRONE_STOCK = 10;


    mapping(address => address[]) dronAsset;
    address[DRONE_STOCK] reservedDrones;
    uint256 lastId;
    uint8 counterStock;
    uint8 counterReserved;
    address owner ;
    address[DRONE_STOCK] stockDrones;

    event stockAvaliable (uint id) ;
    event droneDeployed (address drone,address owner);
    event droneReserved (address owner);

    modifier onlyOwner () {
        require (owner == msg.sender,"Only owner");
        _;
    }
    modifier stockRequired () {
        require (counterStock > 0,"Without Stock");
        _;
    }
    modifier enoughValue() {
        require (msg.value >= DRONE_PRICE,"Insufficient value");
        _;
    }

    constructor() public {
        lastId = 0;
        owner = msg.sender;
        counterStock = 0;
        counterReserved = 0;
        makeDrones();
    }

    function makeDrones() private {
        for(;counterStock<DRONE_STOCK;counterStock++) {
            stockDrones[counterStock] = makeDrone();
            Drone dron = Drone(stockDrones[counterStock]);
            emit stockAvaliable(dron.getId());
        }
    }

    function makeDrone() private returns(address) {
        lastId++;
        Drone newDrone = new Drone(lastId);
        newDrone.initialize(DRONE_MAXHEIGHT,DRONE_MINHEIGHT,DRONE_RANGE);
        return address(newDrone);
    }

    function getStockDrone() private returns(address) {
        counterStock = counterStock - 1;
        address dron = stockDrones[counterStock];
        stockDrones[counterStock] = address(0);
        return dron;
    }

    function buyDrone() public stockRequired enoughValue payable returns(Drone){
        address newDrone = getStockDrone();
        dronAsset[msg.sender].push(newDrone);
        emit droneDeployed(newDrone,msg.sender);
    }

    function reserveDrone () public {
        if (counterStock>0) {
            Drone dron = Drone(stockDrones[counterStock-1]);
            emit stockAvaliable(dron.getId());
        }
        else {
            emit droneReserved(msg.sender);
            //makeDrones();
        }
    }

    function destroyFactory() public onlyOwner {
        selfdestruct(msg.sender);
    }

    function getStock() public view returns(uint8) {
        return counterStock;
    }
*/
}