## ΞBlockBook - Payment Request System based on Ethereum

BlockBook is a full-stack decentralized payment request system.

### Feature
* Ethereum smart contract as back-end
* Web application with Web3.js to interact with the smart contract
* Hacked together without proper knowledge in both Solidity and web front-end

### Why Blockchain
* **Distributed consensus:** Both record and process logic are **not** controlled by a single party, the system can only be tempered when the majority of particapants cooperated.
* **Decentralized system:** The system is down only when every single node in the network is down. Since there's no limit on the number of nodes and everyone can setup a node, zero downtime is achievable. 
* **Access control:** A person in the system is represented by an address, every operation is signed with the private key of the corresponding address. Access control is done by checking the address that signs an operation. **No more username and password**.
* **Fast development:** See feature III


### Privacy
(Currently)There is no privacy on Ethereum blockchain, any record uploaded can be viewed, even if there is no corresponding contract function call. Decryption and encryption can(should) only be done on the client side.

The tricky problem is that both payment requester and approver have to be able to decrypt the record. 

One solution is to keep two copies of encrypted record, one encrypted with approver's public key, another with the requester's. The other is to use [secret sharing](https://en.wikipedia.org/wiki/Shamir's_Secret_Sharing).

Encryption also bloats the record.

### Public or Private network
* Deploying on public network:
    * More secure
    * Zero downtime 
    * No server required
    * Cost real $$ to operate

* Deploying on private network:
    * Less secure
    * System is down when every node is down
    * Must have at least one node
    * Free to operate, but maintaining node still cost money

Currently the system is deployed on a [Proof of Authority (PoA)](https://github.com/ethcore/parity/wiki/Proof-of-Authority-Chains) private chain. Instead of mining, the block is produced by authorities specified in the chain specification, either with list or smart contract(parity 1.6+).

Using list to specify the authorities is less flexible than using smart contract, since the list of authorities cannot be changed, and the network isn't easily scalable.


### System Structure
Single node (Centralized):
<p align="center"><img src="https://github.com/vicodin1123/BlockBook/blob/master/Documents/pics/structure.png?raw=true" alt="structure"></p>
Multiple node (Decentralized):
<p align="center"><img src="https://github.com/vicodin1123/BlockBook/blob/master/Documents/pics/structure2.png?raw=true" alt="structure2"></p>

### Request Status
<p align="center"><img src="https://github.com/vicodin1123/BlockBook/blob/master/Documents/pics/request_status.png?raw=true" alt="request_status"></p>

### Roles
* Admin: Role assignment
* Giver: Payment request approving
* Beggar: Payment requesting

<p align="center"><img src="https://github.com/vicodin1123/BlockBook/blob/master/Documents/pics/giver_option.png?raw=true" alt="giver_option"></p>


### Usage
1. Basic setup:

Install [MetaMask](https://metamask.io/) on Chrome to access the system via browser
or 
Install [Mist browser](https://github.com/ethereum/mist/releases) to access the system via a standalone program

2. Tell the Admin your address and the name you wished to display
3. Start using





### Development Setup
#### TestRPC

##### Make sure Node.js and NPM are installed
```
$ apt-get install build-essential python
$ npm install ethereumjs-testrpc -g
$ npm install web3 -g
$ testrpc -u 0
```

#### Truffle
```
$ npm install webpack -g
$ npm install truffle -g
$ truffle init webpack
```

#### Testing
```
$ truffle compile
$ truffle migrate
$ npm run dev
```

#### Building
```
$ truffle compile
$ truffle migrate       --> Creates contract artifacts
$ npm run build         --> Creates webpage
```