(async () => {
    try {
        console.log('Running deployWithEthers script...')
    /*
        const contractName = 'Storage' // Change this for other contract
        const constructorArgs = []    // Put constructor args (if any) here for your contract

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated
        const artifactsPath = `browser/contracts/artifacts/${contractName}.json` // Change this for different path
    
        const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        // 'web3Provider' is a remix global variable object
        const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    
        let factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);
    
        let contract = await factory.deploy(...constructorArgs);
    
        console.log('Contract Address: ', contract.address);
    
        // The contract is NOT deployed yet; we must wait until it is mined
        await contract.deployed()
        console.log('Deployment successful.')
        */
        const attackConfig = {name: 'GatekeeperOneAttack', address: '0x9b5B76ac98D26825fB809F953c1A3B63E2e16e0c'};
        const challengeConfig = {name: 'GatekeeperOne', address: '0xF1eD752dF2889567cc75E49155E1347249A5F0e1'};

        console.log("Trying this way... ", attackConfig, challengeConfig);
        const attacker = ethers.getContract(attackConfig.name, attackConfig.address);
        console.log(attacker);

    } catch (e) {
        console.log(e.message)
    }
})()