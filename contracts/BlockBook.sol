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
	enum RequestStatus { PendingApproval, Approved, Paid, Disputed, Removed }


	/*Entry struct*/
	struct Request {
		uint amount;
		string reason;
		string receiptURL;
		uint createdOn;
	}
	struct Fund {
		uint amount;
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
		uint budget;
		Fund[] funds;
	}
	struct Beggar {
		string name;
		uint addressIndex;
		uint requested;
		uint paid;
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
    
    
	/*Admin function*/
	function BlockBook() {
	    admin = msg.sender;
	    
	    // Dummy address to help acount removal
	    beggarAddresses.push(0);
	    
	    
	    // FOR TESTING
	    addBeggar(msg.sender, "admin");
	}
    
    function addBeggar(address targetAddress, string name) onlyAdmin {
        if (isBeggar[targetAddress] || giver.addr == targetAddress) throw;
        
        beggars[targetAddress].name = name;
        beggars[targetAddress].removeVote = RemoveVote({giverVote: false, adminVote: false});
        beggars[targetAddress].addressIndex = beggarAddresses.length;
        
        beggarAddresses.push(targetAddress);

        isBeggar[targetAddress] = true;
    }
    
    function setGiver(address targetAddress, string name) onlyAdmin {
        giver.addr = targetAddress;
        giver.name = name;
    }
    
    function transferAdmin(address targetAddress) onlyAdmin {
        admin = targetAddress;
    }

    /*Beggar function*/
    function addRequest(uint amount, string reason, string receiptURL) onlyBeggar {
        beggars[msg.sender].requests.push( Request({
            amount: amount, 
            reason: reason,
            receiptURL: receiptURL,
            createdOn: now
        }) );
        beggars[msg.sender].requestStatus.push( RequestStatus.PendingApproval );
        beggars[msg.sender].requested += amount;
    }
    
    /*Giver function */
    

	/*Getter*/
	function getBeggars() constant returns (address[]) {
	   return beggarAddresses;
	}
	
	function getRequstedAmount(address targetAddress) onlyTargetBeggar(targetAddress)
	    constant returns (uint) 
    {
	    return beggars[targetAddress].requested;
	}
	
	function getPaidAmount(address targetAddress) onlyTargetBeggar(targetAddress) 
	    constant returns (uint) 
    {
	    return beggars[targetAddress].paid;
	}
	
	function getName(address targetAddress) onlyTargetBeggar(targetAddress) 
	    constant returns (string)   
    {
	    return beggars[targetAddress].name;
	}	
	
	function getRemoveVote(address targetAddress) onlyTargetBeggar(targetAddress) 
	    constant returns (bool, bool)   
    {
	    return (beggars[targetAddress].removeVote.giverVote, 
	        beggars[targetAddress].removeVote.adminVote);
	}
    
	function getRequest(address targetAddress, uint index) onlyTargetBeggar(targetAddress) 
	    constant returns (uint, string, string, uint)   
    {
        if (index >= beggars[targetAddress].requests.length) return;
        
        return (beggars[targetAddress].requests[index].amount,
		beggars[targetAddress].requests[index].reason,
		beggars[targetAddress].requests[index].receiptURL,
		beggars[targetAddress].requests[index].createdOn);
	}
	
	function listRequestStatus(address targetAddress) onlyTargetBeggar(targetAddress) 
	    constant returns (RequestStatus[])
    {
       return beggars[targetAddress].requestStatus;
    }
	    

}
