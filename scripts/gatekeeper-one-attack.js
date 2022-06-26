// const { hre } = require("@nomiclabs/hardhat-ethers")

(async () => {
    // 0xF1eD752dF2889567cc75E49155E1347249A5F0e1
    const victimAddress = '0xF1eD752dF2889567cc75E49155E1347249A5F0e1';
    //const {ethers} = require("@nomiclabs/hardhat-ethers")

    try {
        console.log(`Attacking 'GatekeeperOne' contract at ... ${victimAddress}`);
        console.log(ethers.provider.getContract("GatekeeperOne", victimAddress));
        // const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        // const contract = ethers.getContractAt("GatekeeperOne", victimAddress);
        // console.log(contract);

        // const victim = ( new ethers.Contract("GatekeeperOne", victimAddress));
        // console.log(victim);
    } catch (e) {
        console.log(e.message)
    }
})()