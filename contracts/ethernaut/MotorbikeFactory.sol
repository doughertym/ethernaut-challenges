// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "./Level.sol";
import "./Motorbike.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";

contract MotorbikeFactory is Level {

    mapping(address => address) private engines;
    uint public engineCount = 0;

    function createInstance(address _player) public payable override returns (address) {
        _player;

        Engine engine = new Engine();
        Motorbike motorbike = new Motorbike(address(engine));
        engines[address(motorbike)] = address(engine);
        engineCount++;

        require(
            keccak256(Address.functionCall(
                    address(motorbike),
                    abi.encodeWithSignature("upgrader()")
                )) == keccak256(abi.encode(address(this))),
            "Wrong upgrader address"
        );

        require(
            keccak256(Address.functionCall(
                    address(motorbike),
                    abi.encodeWithSignature("horsePower()")
                )) == keccak256(abi.encode(uint256(1000))),
            "Wrong horsePower"
        );

        emit LevelInstanceCreatedLog(_player, address(motorbike));
        return address(motorbike);
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        _player;
        console.log("validateInstance", _instance, _player, engines[_instance]);
        if (!Address.isContract(engines[_instance])) {
            emit LevelCompletedLog(_player, _instance);
        }
        return false;
    }
}