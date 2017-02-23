// Import other JS
var storage = require('./storage');
var struct = require('./struct');

var BlockBook;
var web3;

// Enum

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

var getBeggarAddress = function () {
	var self = this;
	var meta;	

	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.getBeggars();
	}).then(function(value) {
		storage.beggars.info = new Array(value.len).fill(0);
	    storage.beggars.address = value;
	    return value;
	});
};
/*Admin function*/
var addBeggar = function (address, name) {
	var meta;	

	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.addBeggar(address, name, {from: myAccount, gas: 200000});
	}).then(function(value) {
	    return value;
	});
};

// Retrieve and store info
var refreshBeggarInfo = function (address) {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.getBeggar(address);
	}).then(function(value) {
		// Second value = index;

		var beggar = new struct.Beggar(value[0],
		value[1], value[2], value[3], value[4], [], [], []);
		index = value[1];

		storage.beggars.info[index] = beggar;
	    return beggar;
	});
}

/*Beggar function*/
var addRequest = function (amount, reason, receiptURL) {
	var meta;	

	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.addRequest(amount, reason, receiptURL, {from: myAccount, gas: 200000});
	});
}

/*Giver function*/
var changeRequestStatus = function (targetAddress, requestIndex, toStatus) 
{
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.changeRequestStatus(targetAddress, requestIndex, toStatus, {from: myAccount, gas: 200000});
	});
}

/*Events*/
var roleUpdateEvent = function () {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.RoleUpdate();
	});
};

var newApprovalEvent = function () {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.NewApproval();
	});
};

var newRequestEvent = function () {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.NewRequest();
	});
};

var newPaidEvent = function () {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.NewPaid();
	});
};

// module.exports = {
// 	initContract: initContract,
// 	getBeggarList: getBeggarList
// };


/*Enum*/
var RequestStatus = {
	PendingApproval: 0,
	Approved: 1,
	Paid: 2,
	Disputed: 3,
	Removed: 4
};

var FundStatus = {
	Active: 0,
	Removed: 1
};

module.exports = {  
	newPaidEvent: newPaidEvent,
	newRequestEvent: newRequestEvent,
	newApprovalEvent: newApprovalEvent,
	changeRequestStatus: changeRequestStatus,
	RequestStatus: RequestStatus,
	FundStatus: FundStatus,
	initContract: initContract,
	getBeggarAddress: getBeggarAddress,
	addBeggar: addBeggar,
	addRequest: addRequest,
	refreshBeggarInfo: refreshBeggarInfo,
	roleUpdateEvent: roleUpdateEvent,

};