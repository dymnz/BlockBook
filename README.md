## ΞBlockBook - Payment Request System based on Ethereum

BlockBook is a full-stack decentralized payment request system. The project includes Ethereum smart contract as back-end, and a webpage to ineract with the former.

### Structure
Centralized node:
<p align="center"><img src="https://github.com/vicodin1123/BlockBook/blob/master/Documents/pics/structure.png?raw=true" alt="structure"></p>
Decentralized node:
<p align="center"><img src="https://github.com/vicodin1123/BlockBook/blob/master/Documents/pics/structure2.png?raw=true" alt="structure2"></p>

### Request Status
<p align="center"><img src="https://github.com/vicodin1123/BlockBook/blob/master/Documents/pics/request_status.png?raw=true" alt="request_status"></p>

### Roles
* Admin: Role assignment
* Giver: Payment request approving
* Beggar: Payment requesting

<p align="center"><img src="https://github.com/vicodin1123/BlockBook/blob/master/Documents/pics/giver_option.png?raw=true" alt="giver_option"></p>




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
$ truffle compile
$ truffle migrate
```

#### Run
```
$ npm run dev
```