## Ξ BlockBook - Ethereum smart contract based payment request system

### Roles
* Admin: Role assignment, Beggar removal voting
* Giver: Payment request approving
* Beggar: Payment requesting

### 
<p align="center"><img src="https://github.com/vicodin1123/BlockBook/blob/master/Documents/pics/giver_option.png?raw=true" alt="giver's option"></p>




## Development Setup
### TestRPC Setup

#### Make sure Node.js and NPM are installed
```
$ apt-get install build-essential python
$ npm install ethereumjs-testrpc -g
$ npm install web3 -g
$ testrpc -u 0
```

### Truffle Setup
```
$ npm install webpack -g
$ npm install truffle -g
$ truffle init webpack
$ truffle compile
$ truffle migrate
```

### After Pulling
```
$ npm install
$ truffle compile
$ truffle migrate
```
