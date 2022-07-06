const {ethers, network} = require("hardhat")
const {expect, assert} = require("chai")
const {
    parseEvents,
    getContract,
    createLevelInstance
} = require("./helpers");

const levelName = 'DoubleEntryPoint';
const levelFactoryName = 'DoubleEntryPointFactory';

describe(`Solving the ${levelName} challenge.`, () => {
    let accounts, player, target, targetAddress, engine, attacker;
    before(async () => {
        console.log("before()");
        accounts = (await ethers.getSigners());
        player = (await accounts[0]).address;
        let attackerAddress;
        if (network.name === 'rinkeby') {
            assert.equal(player, '0xe5e00c76DB49E2aB2294b19dDb3145C8975cF8a2',
                `Address at first account (${player}) is not correct.`);
            targetAddress = '0x74F641f32F5A638b4cC74De3aB65e4fEdCbe6F0D';
            attackerAddress = '';
        }
        if (network.name === 'hardhat') {
            console.log(`Running on ${network.name} network, createLevelInstance() for ${player}...`);
            target = await createLevelInstance(
                player, levelFactoryName, levelName
            );
        } else {
            target = await getContract(levelName, targetAddress);
        }
        expect(target).to.not.be.null;

        attacker = await getContract("DoubleEntryPointAttacker");
        expect(attacker).to.not.be.null;
    });

    it(`attacks ${levelName}...`, async () => {
        const fortaAddress = await target.forta();
        (await attacker.setForta(fortaAddress)).wait();
        const forta = await getContract('Forta', fortaAddress);
        let txn = await forta
            .setDetectionBot(await attacker.address);
        txn.wait(1);
    });

    after(async () => {
        console.log("after");
        if (network.name === 'hardhat') {
            const validator = await getContract(levelFactoryName);
            expect(validator).to.not.be.null;
            let txn = await validator.validateInstance(await target.address, player, {
                gasPrice: 9000000000,
            });
            const events = await parseEvents(txn, validator.interface);
            expect(events).to.be.an('array').that.is.not.empty;
            const found = events.find(e => e.name === 'LevelCompletedLog');
            assert.isNotNull(found, `Local blockchain validation failed for ${levelName} challenge.`);
        }
    });

});