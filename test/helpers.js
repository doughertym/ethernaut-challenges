const { ethers, network } = require("hardhat")

const getContract = async (contractName, contractAddress) => {
    console.log(`test/helpers: getContract(${contractName}, ${contractAddress})`);
    const factory = await ethers.getContractFactory(contractName);
    let contract;
    if (contractAddress) {
        console.log(`test/helpers: Getting ${contractName} at ${contractAddress} on ${network.name}...`);
        contract = await factory.attach(contractAddress);
    } else {
        console.log(`test/helpers: Deploying ${contractName} on ${network.name}...`);
        contract = await factory.deploy();
    }
    return contract;
};

const createLevelInstance = async (playerAddress, factoryName, contractName) => {
    console.log(`test/helpers: createLevelInstance(${playerAddress}, ${factoryName}, ${contractName})`);
    const levelFactory = await getContract(factoryName);
    console.log(`${factoryName}.address = ${await levelFactory.address}`);
    let txn = await levelFactory.createInstance(playerAddress, {
        value: ethers.utils.parseEther('0.001')
    })
    txn.wait(1);

    let receipt = await ethers.provider.getTransactionReceipt(txn.hash);
    console.log(`Create contract instance receipt: `, receipt);
    const log = levelFactory.interface.parseLog(receipt.logs[0]);
    let targetAddress = log.args.instance;

    console.log(`Deployed ${contractName} using level factory at ${await levelFactory.address} to ${targetAddress}`);
    return getContract(contractName, targetAddress);
};

const sleep = async (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

module.exports = {
    getContract,
    createLevelInstance,
    sleep
};