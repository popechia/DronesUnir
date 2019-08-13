pragma solidity >=0.4.25 <0.6.0;

library Constants {
    enum PEST {NITRITO,NITRATO}

    function getNitrito() public pure returns(uint){
        return uint(PEST.NITRITO);
    }
}