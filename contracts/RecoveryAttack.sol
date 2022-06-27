// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract RecoveryAttack {

    function attack(address _owner) public {
        // 0xe5e00c76DB49E2aB2294b19dDb3145C8975cF8a2
        address tokenAddress = address(0xcb327330b8a7be61ae6defb7377b96d741a68fef);
        address computed = address(keccak256(rlp(_owner, 129))[12:31]);


    }
}