function Request(amount, reason, receiptURL, createdOn, addr, index) {
    if (arguments.length != Request.length) {
        throw 'Not enough arguments: Request'
    }

    this.amount = amount;
    this.reason = reason;
    this.receiptURL = receiptURL;
    this.createdOn = createdOn;

    // For UI convenience
    this.addr = addr
    this.index = index;
}
function Fund(amount, reason) {
    if (arguments.length != Fund.length)
        throw 'Not enough arguments: Fund'

    this.amount = amount;
    this.reason = reason;
}
function RemoveVote(giverVote, adminVote) {
    if (arguments.length != RemoveVote.length)
        throw 'Not enough arguments: RemoveVote'

    this.giverVote = giverVote;
    this.adminVote = adminVote;
}

function Giver(addr, addressIndex, budget, approved, paid, funds, fundStatus) {
    if (arguments.length != Giver.length)
        throw 'Not enough arguments: Giver'

    this.addr = addr;
    this.addressIndex = addressIndex;
    this.budget = budget;
    this.approved = approved;
    this.paid = paid;
    this.funds = funds;
    this.fundStatus = fundStatus;
}
function Beggar(name, addressIndex, requested, approved, paid, requests, requestStatus, removeVote) {
    if (arguments.length != Beggar.length) {
        throw 'Not enough arguments: Beggar'
    }
    

    this.name = name;
    this.addressIndex = addressIndex;
    this.requested = requested;
    this.approved = approved;
    this.paid = paid;
    this.requests = requests;
    this.requestStatus = requestStatus;
    this.removeVote = removeVote;
}

module.exports = {
	Request: Request,
	Fund: Fund,	
	RemoveVote: RemoveVote,
	Giver: Giver,
	Beggar: Beggar
};