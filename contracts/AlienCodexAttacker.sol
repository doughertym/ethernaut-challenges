// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface AlienCodex {
}

contract AttackableAlienCodex is AlienCodex {
    function takeOwnership(address newOwner) public {
        //_transferOwnership(newOwner);
    }
}

contract AlienCodexAttacker {

    function attack(address target, address newOwner) public {
        AttackableAlienCodex challenge = AttackableAlienCodex(target);
        challenge.takeOwnership(newOwner);
    }
    
}