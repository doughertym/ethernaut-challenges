// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import '@openzeppelin/contracts/access/Ownable.sol';

abstract contract Level is Ownable {
    event LevelInstanceCreatedLog(address indexed player, address instance);
    event LevelCompletedLog(address indexed player, address instance);

    function createInstance(address _player) virtual public payable returns (address);
    function validateInstance(address payable _instance, address _player) virtual public returns (bool);
}