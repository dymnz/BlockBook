pragma solidity ^0.4.2;

contract BlockBook {

	enum AccountRole { Admin, Giver, Beggar }
	enum FundStatus { Active, Removed }
	enum RequestStatus { PendingApproval, Approved, Paid, Disputed, Removed, Rejected }

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
    struct Admin {
        address addr;
        string name;
    }
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
	Admin admin;
	Giver giver;
	address[] beggarAddresses;
	mapping (address => bool) isBeggar;
	mapping (address => Beggar) beggars;

    
    /*Modifier*/
    modifier onlyAdmin {
        if ( msg.sender != admin.addr )
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
    event NewRejection(address indexed _beggarAddress, uint24 _requestIndex);
    event DisputeResolved(address indexed _beggarAddress, uint24 _requestIndex);
    event RoleUpdate(address indexed _from, address indexed _to, AccountRole indexed _role);

	/*Admin function*/////////////////////////////////////////////////////////
	function BlockBook() {
	    admin.addr = msg.sender;
        admin.name = "admin";
	    
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
    
    function transferAdmin(address targetAddress, string name) onlyAdmin {
        admin.addr = targetAddress;
        admin.name = name;

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
            beggars[msg.sender].requested 
                -= beggars[msg.sender].requests[requestIndex].amount;

            NewRemove(msg.sender, uint24(requestIndex) );
            return true;
        }
        
        if (beggars[msg.sender].requestStatus[requestIndex] 
            == RequestStatus.Approved) {
            beggars[msg.sender].requestStatus[requestIndex] 
                = RequestStatus.Removed;
            beggars[msg.sender].approved 
                -= beggars[msg.sender].requests[requestIndex].amount;                
            giver.approved 
                -= beggars[msg.sender].requests[requestIndex].amount;                
            
            NewRemove(msg.sender, uint24(requestIndex) );
            return true;
        }

        if (beggars[msg.sender].requestStatus[requestIndex] 
            == RequestStatus.Rejected) {
            beggars[msg.sender].requestStatus[requestIndex] 
                = RequestStatus.Removed;

            NewRemove(msg.sender, uint24(requestIndex) );
            return true;            
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
        
        // "PendingApproval" -> "Approved" or "Paid" or "Rejected"
        if (beggars[targetAddress].requestStatus[requestIndex] 
            == RequestStatus.PendingApproval) {
            if (toStatus == RequestStatus.Approved) {
                beggars[targetAddress].requestStatus[requestIndex] 
                    = RequestStatus.Approved;
                beggars[targetAddress].requested 
                    -= beggars[targetAddress].requests[requestIndex].amount;
                beggars[targetAddress].approved
                    += beggars[targetAddress].requests[requestIndex].amount;                      
                giver.approved 
                    += beggars[targetAddress].requests[requestIndex].amount;
				NewApproval(targetAddress, requestIndex);  

            } else if (toStatus == RequestStatus.Paid) {
                beggars[targetAddress].requestStatus[requestIndex] 
                    = RequestStatus.Paid;
                beggars[targetAddress].requested 
                    -= beggars[targetAddress].requests[requestIndex].amount;                    
                beggars[targetAddress].paid 
                    += beggars[targetAddress].requests[requestIndex].amount;
                giver.paid 
                    += beggars[targetAddress].requests[requestIndex].amount; 
				NewPaid(targetAddress, requestIndex);
            } else if (toStatus == RequestStatus.Rejected) {
                beggars[targetAddress].requestStatus[requestIndex] 
                    = RequestStatus.Rejected;
                beggars[targetAddress].requested 
                    -= beggars[targetAddress].requests[requestIndex].amount;  

                NewRejection(targetAddress, requestIndex);    
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
        if (msg.sender == admin.addr)  
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
    function getAdminInfo() constant returns (address, string) {
        return (admin.addr, admin.name);
    }
	
	/*Beggar Getter*/////////////////////////////////////////////////////////
    function listBeggar() constant returns (address[]) {
       return beggarAddresses;
    }

	function getBeggarInfo(address targetAddress) onlyTargetBeggar(targetAddress)
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
    
	function getRequestInfo(address targetAddress, uint24 requestIndex) onlyTargetBeggar(targetAddress) 
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
	function getGiverInfo() constant returns (address, string, uint24, uint24, uint24) {
	    return (giver.addr, 
	            giver.name, 
                giver.budget, 
                giver.approved, 
                giver.paid);
	}

	function getFundInfo(uint24 fundIndex) constant returns (uint24, string)   
    {
        if (fundIndex >= giver.funds.length) return;
        
        return (giver.funds[fundIndex].amount,
	        	giver.funds[fundIndex].reason);
	}

	function listFundStatus() constant returns (FundStatus[])
    {
       return giver.fundStatus;
    }	
}
