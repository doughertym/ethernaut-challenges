REMIX EXAMPLE PROJECT

Remix example project is present when Remix loads for the very first time or there are no files existing in the File Explorer. 
It contains 3 directories:

1. 'contracts': Holds three contracts with different complexity level, denoted with number prefix in file name.
2. 'scripts': Holds two scripts to deploy a contract. It is explained below.
3. 'tests': Contains one test file for 'Ballot' contract with unit tests in Solidity.

SCRIPTS

The 'scripts' folder contains example async/await scripts for deploying the 'Storage' contract.
For the deployment of any other contract, 'contractName' and 'constructorArgs' should be updated (along with other code if required). 
Scripts have full access to the web3.js and ethers.js libraries.

To run a script, right click on file name in the file explorer and click 'Run'. Remember, Solidity file must already be compiled.

Output from script will appear in remix terminal.

### Vault

https://ethernaut.openzeppelin.com/level/0xf94b476063B6379A3c8b6C836efB8B3e10eDe188

Was solved using just Javascript with the help of 

https://cmichel.io/ethernaut-solutions/

```
await contract.unlock( (
    await web3.eth.getStorageAt(contract.address, 1)
) );
```
### Re-entrancy

https://ethernaut.openzeppelin.com/level/0xe6BA07257a9321e755184FB2F995e0600E78c16D

I am not sure I fully get how this worked. The first try, using [ReentranceAttack.sol from Ethernaut](https://github.com/OpenZeppelin/ethernaut/blob/master/contracts/contracts/attacks/ReentranceAttack.sol), did not work. However, using [Christoph Michel](https://cmichel.io/ethernaut-solutions/) did work. 

I need to study this topic further since it is one that has recently been used (I think with Elephant.money).

