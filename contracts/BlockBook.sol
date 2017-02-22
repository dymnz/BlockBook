pragma solidity ^0.4.2;

contract BlockBook {
	
	// mapping (address => uint) balances;
	// event Transfer(address indexed _from, address indexed _to, uint256 _value);
	// function sendCoin(address receiver, uint amount) returns(bool sufficient) {
	// 	if (balances[msg.sender] < amount) return false;
	// 	balances[msg.sender] -= amount;
	// 	balances[receiver] += amount;
	// 	Transfer(msg.sender, receiver, amount);
	// 	return true;
	// }

	// function getBalanceInEth(address addr) returns(uint){
	// 	return ConvertLib.convert(getBalance(addr),2);
	// }

	// function getBalance(address addr) returns(uint) {
	// 	return balances[addr];
	// }
	enum AccountRole { Admin, Giver, Beggar }
	enum FundStatus { Active, Removed }
	enum RequestStatus { PendingApproval, Approved, Paid, Disputed, Removed }


	/*Entry struct*/
	struct Request {
		uint24 amount;
		string reason;
		string receiptURL;
		uint createdOn;
	}
	struct Fund {
		uint24 amount;
		string reason;
	}
	struct RemoveVote {
		bool giverVote;
		bool adminVote;
	}

	/*Member struct*/
	struct Giver {
		address addr;
		string name;
		uint24 budget;
		uint24 approved;
		uint24 paid;
		Fund[] funds;
		FundStatus[] fundStatus;
	}
	struct Beggar {
		string name;
		uint24 addressIndex;
		uint24 requested;
		uint24 approved;
		uint24 paid;
		Request[] requests;
        RequestStatus[] requestStatus;		
		RemoveVote removeVote;
	}

	/*Storage*/
	address admin;
	Giver giver;
	address[] beggarAddresses;
	mapping (address => bool) isBeggar;
	mapping (address => Beggar) beggars;

    
    /*Modifier*/
    modifier onlyAdmin {
        if ( msg.sender != admin )
            return;
        _;
    }
    
    modifier onlyGiver {
        if ( msg.sender != giver.addr )
            return;
        _;
    }
    
    modifier onlyBeggar {
        if ( !isBeggar[msg.sender] )
            return;
        _;
    }
    
    modifier onlyTargetBeggar (address targetAddress) {
        if ( !isBeggar[targetAddress] )
            return;
        _;
    }
    
    
    /*Events*/
    event NewRequest(address indexed _beggarAddress, uint24 _requestIndex);
    event NewRemove(address indexed _beggarAddress, uint24 _requestIndex);
    event NewDispute(address indexed _beggarAddress, uint24 _requestIndex);
    event NewApproval(address indexed _beggarAddress, uint24 _requestIndex);
    event NewPaid(address indexed _beggarAddress, uint24 _requestIndex);
    event DisputeResolved(address indexed _beggarAddress, uint24 _requestIndex);
    event RoleUpdate(address indexed _from, address indexed _to, AccountRole indexed _role);

	/*Admin function*/////////////////////////////////////////////////////////
	function BlockBook() {
	    admin = msg.sender;
	    
	    // FOR TESTING
	    addBeggar(msg.sender, "admin");
	    giver.addr = msg.sender;
	}
    
    function addBeggar(address targetAddress, string name) onlyAdmin {
        if (isBeggar[targetAddress] || giver.addr == targetAddress) throw;
        
        beggars[targetAddress].name = name;
        beggars[targetAddress].removeVote = RemoveVote({giverVote: false, adminVote: false});
        beggars[targetAddress].addressIndex = uint24(beggarAddresses.length);
        
        beggarAddresses.push(targetAddress);

        isBeggar[targetAddress] = true;

        RoleUpdate(msg.sender, targetAddress, AccountRole.Beggar);
    }
    
    function setGiver(address targetAddress, string name) onlyAdmin {
        giver.addr = targetAddress;
        giver.name = name;

        RoleUpdate(msg.sender, targetAddress, AccountRole.Giver);
    }
    
    function transferAdmin(address targetAddress) onlyAdmin {
        admin = targetAddress;

        RoleUpdate(msg.sender, targetAddress, AccountRole.Admin);
    }

    /*Beggar function*/////////////////////////////////////////////////////////
    function addRequest(uint24 amount, string reason, string receiptURL) onlyBeggar {
        beggars[msg.sender].requests.push( Request({
            amount: amount, 
            reason: reason,
            receiptURL: receiptURL,
            createdOn: now
        }) );
        beggars[msg.sender].requestStatus.push( RequestStatus.PendingApproval );
        beggars[msg.sender].requested += amount;

        NewRequest(msg.sender, uint24(beggars[msg.sender].requestStatus.length) - 1);
    }
    
    function disputeRequest(uint requestIndex) onlyBeggar returns (bool) {
        if (requestIndex >= beggars[msg.sender].requests.length) return false;
        
        if (beggars[msg.sender].requestStatus[requestIndex] == RequestStatus.Paid) {
            beggars[msg.sender].requestStatus[requestIndex] = RequestStatus.Disputed;
            return true;
            NewDispute(msg.sender, uint24(requestIndex));
        }
        
    }
    
    function removeRequest(uint requestIndex) onlyBeggar returns (bool) {
        if (requestIndex >= beggars[msg.sender].requests.length) return false;
       
        if (beggars[msg.sender].requestStatus[requestIndex] == RequestStatus.Paid ||
            beggars[msg.sender].requestStatus[requestIndex] == RequestStatus.Disputed) 
            return false;
        
        if (beggars[msg.sender].requestStatus[requestIndex] 
            == RequestStatus.PendingApproval) {
            beggars[msg.sender].requestStatus[requestIndex] 
                = RequestStatus.Removed;
            return true;
            NewRemove(msg.sender, uint24(requestIndex) );
        }
        
        if (beggars[msg.sender].requestStatus[requestIndex] 
            == RequestStatus.Approved) {
            beggars[msg.sender].requestStatus[requestIndex] 
                = RequestStatus.Removed;
            beggars[msg.sender].approved 
                -= beggars[msg.sender].requests[requestIndex].amount;                
            giver.approved 
                -= beggars[msg.sender].requests[requestIndex].amount;                
            return true;
            NewRemove(msg.sender, uint24(requestIndex) );
        }        
        
    }
    
    
    /*Giver function*/////////////////////////////////////////////////////////
    function addFund(uint24 amount, string reason) onlyGiver {
        giver.funds.push( Fund({amount: amount, reason: reason}) );
        giver.fundStatus.push(FundStatus.Removed);
        
        giver.budget += amount;
    }
    
    function deleteFund(uint24 fundIndex) onlyGiver {
        if (fundIndex >= giver.funds.length || 
            giver.fundStatus[fundIndex] == FundStatus.Removed) return;
        
        giver.budget -= giver.funds[fundIndex].amount;
        giver.fundStatus[fundIndex] = FundStatus.Removed;
    }
    
    function changeRequestStatus(address targetAddress, uint24 requestIndex,
    RequestStatus toStatus) onlyGiver onlyTargetBeggar(targetAddress) returns (bool)
    {
        if (requestIndex >= beggars[targetAddress].requests.length) return false;
        
        // "PendingApproval" -> "Approved" or "Paid"
        if (beggars[targetAddress].requestStatus[requestIndex] 
            == RequestStatus.PendingApproval) {
            if (toStatus == RequestStatus.Approved) {
                beggars[targetAddress].requestStatus[requestIndex] 
                    = RequestStatus.Approved;
                beggars[targetAddress].approved 
                    += beggars[targetAddress].requests[requestIndex].amount;                       
                giver.approved 
                    += beggars[targetAddress].requests[requestIndex].amount;
				NewApproval(targetAddress, requestIndex);  

            } else if (toStatus == RequestStatus.Paid) {
                beggars[targetAddress].requestStatus[requestIndex] 
                    = RequestStatus.Paid;
                beggars[targetAddress].paid 
                    += beggars[targetAddress].requests[requestIndex].amount;
                giver.paid 
                    += beggars[targetAddress].requests[requestIndex].amount; 
				NewPaid(targetAddress, requestIndex);

            } else {
                return false;
            }
            return true;
        } 
        // "Approved" -> "Paid"
        else if (beggars[targetAddress].requestStatus[requestIndex] 
            == RequestStatus.Approved) {
            if (toStatus == RequestStatus.Paid) {
                beggars[targetAddress].requestStatus[requestIndex] 
                    = RequestStatus.Paid;
                beggars[targetAddress].approved 
                    -= beggars[targetAddress].requests[requestIndex].amount;                     
                beggars[targetAddress].paid  
                    += beggars[targetAddress].requests[requestIndex].amount;
                giver.approved 
                    -= beggars[targetAddress].requests[requestIndex].amount;                     
                giver.paid 
                    += beggars[targetAddress].requests[requestIndex].amount;                     
				NewPaid(targetAddress, requestIndex);                    
            } else {
                return false;
            }
            return true;
        }
        // "Disputed" -> "Approved" or "Paid"
        else if  (beggars[targetAddress].requestStatus[requestIndex] 
            == RequestStatus.Disputed) {
            if (toStatus == RequestStatus.Paid) {
                beggars[targetAddress].requestStatus[requestIndex] 
                    = RequestStatus.Paid;
				DisputeResolved(targetAddress, requestIndex);

            } else if (toStatus == RequestStatus.Approved) {
                beggars[targetAddress].requestStatus[requestIndex] 
                    = RequestStatus.Paid;
                beggars[targetAddress].approved 
                    += beggars[targetAddress].requests[requestIndex].amount;                     
                beggars[targetAddress].paid  
                    -= beggars[targetAddress].requests[requestIndex].amount;
                giver.approved 
                    += beggars[targetAddress].requests[requestIndex].amount;                    
                giver.paid 
                    -= beggars[targetAddress].requests[requestIndex].amount; 
				DisputeResolved(targetAddress, requestIndex); 

            } else {
            	return false;
            }
            return true;
        }

        return false;
    }

    /*Admin & Giver function*////////////////////////////////////////////////
    function voteDelete(address targetAddress, bool vote)
        onlyTargetBeggar(targetAddress) returns (bool)
    {
        if (msg.sender == admin)  
            beggars[targetAddress].removeVote.adminVote = vote;
        else if (msg.sender == giver.addr)  
            beggars[targetAddress].removeVote.giverVote = vote;
            
        if (beggars[targetAddress].removeVote.adminVote 
            && beggars[targetAddress].removeVote.giverVote) {
            beggarAddresses[beggars[targetAddress].addressIndex] = 0;
            isBeggar[targetAddress] = false;
            return true;
        }
        else
            return false;
    }
    
    
	/*Admin Getter*/////////////////////////////////////////////////////////
	function getBeggars() constant returns (address[]) {
	   return beggarAddresses;
	}
	
	/*Beggar Getter*/////////////////////////////////////////////////////////
	function getBeggar(address targetAddress) onlyTargetBeggar(targetAddress)
	    constant returns (string, uint24, uint24, uint24, uint24) 
    {
        return (beggars[targetAddress].name, 
		        beggars[targetAddress].addressIndex,
		        beggars[targetAddress].requested,
		        beggars[targetAddress].approved,
		        beggars[targetAddress].paid);
    }
    
	function getRemoveVote(address targetAddress) onlyTargetBeggar(targetAddress) 
	    constant returns (bool, bool)   
    {
	    return (beggars[targetAddress].removeVote.giverVote, 
	            beggars[targetAddress].removeVote.adminVote);
	}
    
	function getRequest(address targetAddress, uint24 requestIndex) onlyTargetBeggar(targetAddress) 
	    constant returns (uint24, string, string, uint)   
    {
        if (requestIndex >= beggars[targetAddress].requests.length) return;
        
        return (beggars[targetAddress].requests[requestIndex].amount,
	        	beggars[targetAddress].requests[requestIndex].reason,
		        beggars[targetAddress].requests[requestIndex].receiptURL,
		        beggars[targetAddress].requests[requestIndex].createdOn);
	}
	
	function listRequestStatus(address targetAddress) onlyTargetBeggar(targetAddress) 
	    constant returns (RequestStatus[])
    {
       return beggars[targetAddress].requestStatus;
    }
	    
    /*Giver Getter*/////////////////////////////////////////////////////////
	function getGiver() constant returns (address, string, uint24, uint24, uint24) {
	    return (giver.addr, 
	            giver.name, 
                giver.budget, 
                giver.approved, 
                giver.paid);
	}
	
	function listFundStatus() constant returns (FundStatus[])
    {
       return giver.fundStatus;
    }	
}
