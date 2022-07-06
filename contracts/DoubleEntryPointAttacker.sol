// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "./ethernaut/DoubleEntryPoint.sol";

contract DoubleEntryPointAttacker is IDetectionBot {
    Forta public forta;

    function setForta(address fortaAddress) public {
        forta = Forta(fortaAddress);
    }

    function handleTransaction(address user, bytes calldata msgData) public override {
        console.log( "handleTransaction", user, address(this));
        forta.raiseAlert(user);
    }
}
