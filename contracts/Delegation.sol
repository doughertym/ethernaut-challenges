// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

// https://ethernaut.openzeppelin.com/level/0x9451961b7Aea1Df57bc20CC68D72f662241b5493

interface Delegate {
    function pwn() external;
}
interface Delegation {
}

contract DelegationChallenge {

    // 0x43b9E4A016b497992b394b411cD19268E7F329F3
    Delegation delegation = Delegation(0x43b9E4A016b497992b394b411cD19268E7F329F3);
    
}