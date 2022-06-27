// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface MagicNum {
    function setSolver(address _solver) external;
}

contract MagicNumberAttacker {

    function attack(address target) public {
        bytes memory bytecode = hex"600a600c600039600a6000f3602a60005260206000f3";
        bytes32 salt = 0;
        address solver;

        assembly {
            solver := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        MagicNum challenge = MagicNum(target);
        challenge.setSolver(solver);
    }
}