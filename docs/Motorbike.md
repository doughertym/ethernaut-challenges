# Motorbike
_Difficulty 6/10_

Ethernaut's motorbike has a brand new upgradeable engine design.

Would you be able to `selfdestruct` its engine and make the motorbike unusable ?

Things that might help:

* [EIP-1967](https://eips.ethereum.org/EIPS/eip-1967)
* [UUPS](https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786) upgradeable pattern
* [Initializable](https://github.com/OpenZeppelin/openzeppelin-upgrades/blob/master/packages/core/contracts/Initializable.sol) contract

-----

## Notes

In [Writing Upgradeable Contracts](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable), there is a note that...

> **Potentially Unsafe Operations**
>
> When working with upgradeable smart contracts, you will always interact with the contract instance, and never with the underlying logic contract. However, nothing prevents a malicious actor from sending transactions to the logic contract directly. This does not pose a threat, since any changes to the state of the logic contracts do not affect your contract instances, as the storage of the logic contracts is never used in your project.
>
> There is, however, an exception. If the direct call to the logic contract triggers a `selfdestruct` operation, then the logic contract will be destroyed, and all your contract instances will end up delegating all calls to an address without any code. This would effectively break all contract instances in your project.
>
> A similar effect can be achieved if the logic contract contains a `delegatecall` operation. If the contract can be made to `delegatecall` into a malicious contract that contains a `selfdestruct`, then the calling contract will be destroyed.
>
> As such, it is not allowed to use either `selfdestruct` or `delegatecall` in your contracts.
> 

This one worked with the help of some of the resources below. The one odd thing was that the `attack()` kept failing with this error:

```
Error: cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="execution reverted", method="estimateGas", transaction={"from":"0xe5e00c76DB49E2aB2294b19dDb3145C8975cF8a2","gasPrice":{"type":"BigNumber","hex":"0x01c9c364"},"to":"0x2cB4bC14812260827103Be9C07826579Cfa85DFd","data":"0xd018db3e00000000000000000000000055d8480cc077f327a74fe77ddc4e846e4238a2a6","accessList":null}, error={"name":"ProviderError","code":-32000,"_isProviderError":true}, code=UNPREDICTABLE_GAS_LIMIT, version=providers/5.6.8)

```
So I thought it was not working. However, after exploring the last transactions for the wallet address, it looked like it was working. So I submitted the level anyway. And viola! It was done. 

* [Dalton Sweeney : Motorbike](https://daltyboy11.github.io/every-ethernaut-challenge-explained/#motorbike)
* https://dev.to/nvn/ethernaut-hacks-level-25-motorbike-397g

Though, to be fair to myself, I did have a pretty good idea where to start exploiting this one. Just needed a little help on the details. 

-----

## Level completed!


The advantage of following an UUPS pattern is to have very minimal proxy to be deployed. The proxy acts as storage layer so any state modification in the implementation contract normally doesn't produce side effects to systems using it, since only the logic is used through delegatecalls.

This doesn't mean that you shouldn't watch out for vulnerabilities that can be exploited if we leave an implementation contract uninitialized.

This was a slightly simplified version of what has really been discovered after months of the release of UUPS pattern.

Takeways: never leaves implementation contracts uninitialized ;)

If you're interested in what happened, read more [here](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680).

