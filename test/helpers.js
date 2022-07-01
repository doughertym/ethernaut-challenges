const { ethers, network } = require("hardhat")

module.exports.getContract = async (contractName, contractAddress) => {
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

module.exports.sleep = async (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}
