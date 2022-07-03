// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import './Level.sol';
import './PuzzleWallet.sol';

contract PuzzleWalletFactory is Level {
    event LevelInstanceCreatedLog(address indexed player, address instance);

    function createInstance(address _player) override public payable returns (address) {
        require(msg.value ==  0.001 ether, "Must send 0.001 ETH to create instance");

        // deploy the PuzzleWallet logic
        PuzzleWallet walletLogic = new PuzzleWallet();

        // deploy proxy and initialize implementation contract
        bytes memory data = abi.encodeWithSelector(PuzzleWallet.init.selector, 100 ether);
        PuzzleProxy proxy = new PuzzleProxy(address(this), address(walletLogic), data);
        PuzzleWallet instance = PuzzleWallet(address(proxy));

        // whitelist this contract to allow it to deposit ETH
        instance.addToWhitelist(address(this));
        instance.deposit{ value: msg.value }();

        emit LevelInstanceCreatedLog(_player, address(proxy));
        return address(proxy);
    }

    function validateInstance(address payable _instance, address _player) override public returns (bool) {
        PuzzleProxy proxy = PuzzleProxy(_instance);

        return proxy.admin() == _player;
    }
}