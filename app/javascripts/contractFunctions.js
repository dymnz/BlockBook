// Import other JS
var storage = require('./storage');
var struct = require('./struct');



var BlockBook;
var web3;

var initContract = function (_blockBook, _web3) {
	var self = this;
	BlockBook = _blockBook;
	web3 = _web3;
	// Bootstrap the MetaCoin abstraction for Use.
	BlockBook.setProvider(web3.currentProvider);

	// Get the initial account balance so it can be displayed.
	web3.eth.getAccounts(function(err, accs) {
		if (err != null) {        
			alert("There was an error fetching your accounts.");
	    	return;
	 	}

		if (accs.length == 0) {
			alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
			return;
		}

	  	myAccount = accs[0];
	});
};

var getBeggarList = function () {
	var self = this;
	var meta;	

	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.getBeggars();
	}).then(function(value) {
	    storage.beggarAddresses = value;
	    return storage.beggarAddresses;
	}).catch(function(e) {
	    throw e;
	});
};

var addBeggar = function (address, name) {
	var self = this;
	var meta;	

	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.addBeggar(address, name, {from: myAccount, gas: 900000});
	}).then(function(value) {
	    return value;
	}).catch(function(e) {
		console.log(e);
	    throw e;
	});
};

var roleUpdateEvent = function () {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.RoleUpdate();
	});
};

// module.exports = {
// 	initContract: initContract,
// 	getBeggarList: getBeggarList
// };

module.exports = {  
  initContract: initContract,
  getBeggarList: getBeggarList,
  addBeggar: addBeggar,
  roleUpdateEvent: roleUpdateEvent
};