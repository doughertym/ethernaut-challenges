// shop = Shop(0xe62c1C275ee55385B744361908097b4Da723e962)
const { ethers, network } = require("hardhat")
const { BigNumber, Contract, Signer } = require("ethers");
const { expect, assert } = require("chai")

describe("Shop challenge", function () {
    const addresses = {
        'challenge': {
            'rinkeby': '0xe62c1C275ee55385B744361908097b4Da723e962',
        },
        'attacker': {
        }
    }

    let accounts;
    let player;
    let targetContract, attacker;
    let targetFactory;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        player = accounts[0];

        if (network.name === 'rinkeby') {
            assert.equal(await player.getAddress(), '0xe5e00c76DB49E2aB2294b19dDb3145C8975cF8a2',
                `Address at first account (${player.address}) is not correct.`);
        }

        targetFactory = await ethers.getContractFactory('Shop');
        const targetAddress = addresses.challenge[network.name];
        console.log(`TargetAddress: ${targetAddress}`);

        if (targetAddress) {
            console.log(`Network is ${network.name}, getting existing contract at ${targetAddress}...`);
            targetContract = await targetFactory.attach(targetAddress);
        } else {
            targetContract = await targetFactory.deploy();
        }
        console.log(`Challenge contract: ${await targetContract.address}`);
        assert.isNotNull(targetContract, `Failed to get Shop instance.`);

        const attackerFactory = await ethers.getContractFactory('ShopAttacker');
        const attackerAddress = addresses.attacker[network.name];
        console.log(`AttackerAddress: ${attackerAddress}`);

        if (attackerAddress) {
            attacker = await attackerFactory.attach(attackerAddress);
            console.log(`Retrieved ShopAttacker from address = ${attacker.address}`);
        } else {
            attacker = await attackerFactory.deploy();
            console.log(`ShopAttacker deployed to address = ${attacker.address}`);
        }
        assert.isNotNull(attacker, `Failed to get ShopAttacker instance.`);
        assert.notEqual(await attacker.address, await targetContract.address);
    });

    it("reduces the price of the Shop", async function () {
        let txn = await attacker.attack(await targetContract.address);
        txn.wait();
        console.log(txn.hash);
        console.log( (await targetContract.price()).toNumber(), await targetContract.isSold() );
    });
});