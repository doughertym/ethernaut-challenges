const { ethers, network } = require("hardhat")

const getContract = async (contractName, contractAddress) => {
    console.log(`test/helpers: getContract(${contractName}, ${contractAddress})`);
    const block = await ethers.provider.getBlock( await ethers.provider.getBlockNumber() );
    const factory = await ethers.getContractFactory(contractName);
    let contract;
    if (contractAddress) {
        console.log(`test/helpers: Getting ${contractName} at ${contractAddress} on ${network.name}...`);
        contract = await factory.attach(contractAddress);
    } else {
        const gasPrice = 5000000000 /* block.baseFeePerGas.toNumber()*/;
        console.log(`test/helpers: Deploying ${contractName} on ${network.name} with gasPrice = ${gasPrice}...`);
        contract = await factory.deploy({
            gasPrice: gasPrice
        });
    }
    return contract;
};

const createLevelInstance = async (playerAddress, factoryName, contractName) => {
    console.log(`test/helpers: createLevelInstance(${playerAddress}, ${factoryName}, ${contractName})`);
    const levelFactory = await getContract(factoryName);
    const block = await ethers.provider.getBlock( await ethers.provider.getBlockNumber() );
    console.log(`${factoryName}.address = ${await levelFactory.address} at block.number = ${await block.number}.`);
    let txn = await levelFactory.createInstance(playerAddress, {
        value: ethers.utils.parseEther('0.001'),
        gasPrice: 5000000000,
    })
    txn.wait(1);

    const events = await parseEvents(txn, levelFactory.interface);
    events.filter(e => e.name === 'LevelInstanceCreatedDebug')
        .forEach((event, index) => {
            console.debug(`Debug event ${index}: player = ${event.args.player}, message = ${event.args.message}`);
        })

    const levelCreated = events.find(e => e.name === 'LevelInstanceCreatedLog');
    if (levelCreated.args.instance == null) {
        throw new Error(`Failed to deploy ${contractName} instance with ${factoryName} at ${await levelFactory.address}`);
    }
    let targetAddress = levelCreated.args.instance;
    console.log(`Deployed ${contractName} using level factory at ${await levelFactory.address} to ${targetAddress}`);
    return getContract(contractName, targetAddress);
};

const parseEvents = async (txn, iface) => {
    let receipt = await ethers.provider.getTransactionReceipt(txn.hash);
    return receipt.logs.map(l => {
        try {
            return iface.parseLog(l);
        } catch (e) {
            for( const topic of l.topics ) {
                try {
                    const event = iface.getEvent(topic);
                    console.log("Parsed event: ", event);
                } catch (e2) {
                    console.log(`Error parsing ${topic} '${e2.code} (${e2.argument}): ${e2.value}'`);
                }
            }
            return null;
        }
    }).filter(log => log != null);
}

const sleep = async (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

module.exports = {
    getContract,
    createLevelInstance,
    parseEvents,
    sleep
};