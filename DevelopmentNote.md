### Contract function
#### 1. Admin:
  1. Assign Beggar role to an address
  `addBeggar(address targetAddress, string name)`

  2. Assign Giver role to an address
  `setGiver(address targetAddress, string name)`

  3. Transfer Admin role to an address
  `transferAdmin(address targetAddress)`

#### 2. Giver:
  1. Change Request status
  `changeRequestStatus(address targetAddress, uint24 requestIndex, RequestStatus toStatus)`


  ```  
  Allowed changes:
  "Pending Approval" -> "Approved"  
  "Pending Approval" -> "Paid"  
  "Approved" -> "Paid"
  "Disputed" -> "Approved"
  "Disputed" -> "Paid"
  ```

  2. Add fund
  `addFund(uint24 amount, string reason)`

  3. Delete fund 
  `deleteFund(uint24 fundIndex)`
  

#### 3. Beggar:
  1. Add a request
  `addRequest(uint24 amount, string reason, string receiptURL)`

  2. Delete a request
  `removeRequest(uint requestIndex)`
  
  3. Dispute a request 
  `disputeRequest(uint requestIndex)`
    

  ```
  Allowed change:
  "Paid" -> "Disputed"
  ```

#### 4. Admin & Giver:
  1. Vote to delete a Beggar
  ` voteDelete(address targetAddress, bool vote)`   

#### 5. UI:
* Admin

1. Get the Admin's data structure
`getAdminInfo()`

* Beggar

1. Get the list of Beggar's addess
`listBeggar()`
2. Get a Beggar's data structure
`getBeggarInfo(address targetAddress)`
3. Get a Beggar's remove voting status
`getRemoveVote(address targetAddress)`
4. Get a Request's data structure
`getRequestInfo(address targetAddress, uint24 requestIndex)`    
5. Get the list of a Beggar's request status
`listRequestStatus(address targetAddress)`

* Giver

1. Get Giver's data structure
`getGiver()`
2. Get a Funds' data structure
`getFundInfo(uint24 fundIndex)`
3. Get the list of Giver's fund status
`listFundStatus()`


### UI function
#### 1. Admin: 
  NO UI required for Admin, contract functions are invoked from console.
    
#### 2. Giver:
  * Request status page (Default page): 
    1. Dispute list (Global)
    `refreshDisputeList()`
    2. Approval pending list (Global)
    `refreshApprovalPeningList()`
    3. Payment pending list (Global)
    `refreshPaymentPendingList()`

  ```
    Implementation:
      1. List beggar
        - Show only active beggar
      2. List request status
        - Show only corresponding requests
      3. Refresh Dispute/ApprovalPending/PaymentPending storage
      4. Refresh UI

    Note: 3 and 4 should be done like refreshBeggarList(), where storage update is invoked by App and ContractFunction update storages as App pulls data. So in the program, storage update is in fact invoked by UI
    Note: List sort from old -> new
  ```
  * Beggar status page:
    1. Beggar info list
  ```
    Implementation:
      1. List Beggar
        - Address 0x0 means account deleted
      2. Update Beggar info
      3. Refresh BeggarList/Beggar's info storage
      4. refresh UI

    Note: 3 and 4 same as above
  ```
  	
  * Fund list:
    1. Fund info list
  ```
    Implementation:
      1. List fund
      2. List fund status
      3. Refresh Giver's Fund storage    
      4. Refresh UI

    Note: 3 and 4 same as above
  ```

##### Toolbar 
  1. Under every request:
  `changeRequestStatus()`
  2. Under every fund:
  `addFund()` and `deleteFund()`

  
#### 3. Beggar:
* Updated request status (Local) (Default page) 
    1. Approval list
    2. Payment list
    3. Pending list
  ```
    Implementation:
      Query event NewApproval
      Quert event NewPaid

      1. List request status
        - Show only corresponding requests
      2. Refresh beggar requests[] storage
      3. Refresh UI
      
    Note: 3 and 4 same as above
    Note: The list sorts from new -> old, except for pending
  ```

##### Toolbar 
  1. Under every request:
  `changeRequestStatus()`

### Data structure

    ## TO BE UPDATED, should reflect differnce in Contract and UI
* Request 
  * Amount
  * Reason
  * Photo of the receipt
    1. Google Drive link (Limit length, use goo.gl to shrink the URL)
    2. FUTURE - Swarm
  * Status enum{"Pending Approval", "Approved", "Paid", "Disputed"}
  * ~~Deadline, if Beggar wish to have~~ (Discarded in first proto)
  
**Every Request is associated with a RequestID. The RequestID is the index of a Request in a Beggar's Request array**

* Fund
  * Amount
  * Reason
  
**Every Fund is associated with a FundID. The FundID is the index of a Fund in a Giver's Fund array**  

* Admin
* Giver
* Beggar

### Issue
1. Change storage.myAccount when switching account in MetaMask  

### Design rules
* A Beggar's Requests is stored in an array under the Beggar's Account (Sandbox)
* Rmoveal of Account requires multi-sig
* To avoid unnecessary query, UI Contract function has two classes: refresh_ and get_. refresh_ queries and returns the latest info; get_ returns the info stored in UI Storage. 

### Possible improvements
1. Request urgency: An attribute of a request that signifies urgency. When showing list, list according to urgency.
  * Will people use this?
2. View protection: A Global view query can only be submitted by Giver. A Local view query can only be submiited by the Local storage owner.
  * An open ledger might be better?
  * Currently not doable on blockchain, must rely other encryption
3. Utilize Solidity public modifier
4. Beggar account transfer
5. Multiple Givers (Departmentalize)
6. Leaving comment on a request
  
### Vocabulary
* Budget: The sum of all funds
* Fund: Giver's budget
* Request: A payment waiting to be filled by a fund
* Account: An identity associated with an address