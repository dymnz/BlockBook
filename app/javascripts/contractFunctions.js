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
	  	storage.myAccount = accs[0];
	});

};

var getMyAccount = function () {
	return storage.myAccount;
};

var refreshBeggarAddress = function () {
	var meta;	

	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.listBeggar();
	}).then(function(value) {
		storage.beggarList.info = new Array(value.len).fill(0);
	    storage.beggarList.address = value;
	    return value;
	});
};

var getBeggarAddress = function () {	
	return storage.beggarList.address;
};

/*Admin function*/
var addBeggar = function (address, name) {
	var meta;	

	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.addBeggar(address, name, {from: storage.myAccount, gas: 200000});
	}).then(function(value) {
	    return value;
	});
};

// Retrieve and store info
var refreshAdminInfo = function () {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.getAdminInfo();
	 }).then(function (admin) {	
	 	storage.admin = new struct.Admin(admin[0], admin[1]);
	 	return storage.admin;
	 });
};

var getAdminInfo = function () {;
	return storage.admin;
}

var refreshBeggarInfo = function (address) {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.getBeggarInfo(address);
	}).then(function(value) {
		// Second value = index;

		var beggar = new struct.Beggar(value[0],
		value[1], value[2], value[3], value[4], [], [], []);
		index = value[1];

		storage.beggarList.info[index] = beggar;
	    return storage.beggarList.info[index];
	});
}

var getBeggarInfo = function (address) {
	index = storage.beggarList.address.findIndex(function (_address) {
		return address = _address;
	});
	if (index == -1)
		throw "Invalid beggar address";

	return storage.beggarList.info[index];
}

//function Giver(addr, addressIndex, budget, approved, paid, funds, fundStatus)
var refreshGiverInfo = function () {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.getGiverInfo();
	 }).then(function (giver) {	
	 	storage.giver = new struct.Giver(giver[0], giver[1], giver[2], giver[3], giver[4], [], []);
	 	return storage.giver;
	 });
}

var getGiverInfo = function () {
	return storage.giver;
}

/*Beggar function*/
var addRequest = function (amount, reason, receiptURL) {
	var meta;	

	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.addRequest(amount, reason, receiptURL, {from: storage.myAccount, gas: 200000});
	});
}

/*Giver function*/
var changeRequestStatus = function (targetAddress, requestIndex, toStatus) 
{
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.changeRequestStatus(targetAddress, requestIndex, toStatus, {from: storage.myAccount, gas: 200000});
	});
}

/*Events*/
var roleUpdateEvent = function (arg1, arg2) {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.RoleUpdate(arg1, arg2);
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

var newDisputeEvent = function () {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.NewDispute();
	});
};

var disputeResolvedEvent = function () {
	return BlockBook.deployed().then(function(instance) {            
	    meta = instance;
	    return meta.DisputeResolved();
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
	newDisputeEvent: newDisputeEvent,
	disputeResolvedEvent: disputeResolvedEvent,
	newPaidEvent: newPaidEvent,
	newRequestEvent: newRequestEvent,
	newApprovalEvent: newApprovalEvent,
	changeRequestStatus: changeRequestStatus,
	RequestStatus: RequestStatus,
	FundStatus: FundStatus,
	initContract: initContract,
	refreshBeggarAddress: refreshBeggarAddress,
	getBeggarAddress: getBeggarAddress,
	addBeggar: addBeggar,
	addRequest: addRequest,
	refreshBeggarInfo: refreshBeggarInfo,
	refreshGiverInfo: refreshGiverInfo,
	refreshAdminInfo: refreshAdminInfo,
	getBeggarInfo: getBeggarInfo,
	getGiverInfo: getGiverInfo,
	getAdminInfo: getAdminInfo,
	getMyAccount: getMyAccount,
	roleUpdateEvent: roleUpdateEvent,

};