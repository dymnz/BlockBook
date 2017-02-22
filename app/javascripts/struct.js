function Request(amount, reason, receiptURL, createdOn) {
    this.amount = amount;
    this.reason = reason;
    this.receiptURL = receiptURL;
    this.createdOn = createdOn;
}
function Fund(amount, reason) {
    this.amount = amount;
    this.reason = reason;
}
function RemoveVote(giverVote, adminVote) {
    this.giverVote = giverVote;
    this.adminVote = adminVote;
}

function Beggar(addr, addressIndex, budget, approved, paid, funds, fundStatus) {
    this.addr = addr;
    this.addressIndex = addressIndex;
    this.budget = budget;
    this.approved = approved;
    this.paid = paid;
    this.funds = funds;
    this.fundStatus = fundStatus;
}
function Beggar(name, addressIndex, requested, approved, paid, requests, requestStatus, removeVote) {
    this.name = name;
    this.addressIndex = addressIndex;
    this.requested = requested;
    this.approved = approved;
    this.paid = paid;
    this.requests = requests;
    this.requestStatus = requestStatus;
    this.removeVote = removeVote;
}