### Contract Function
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
* Beggar
  1. Get the list of Beggar's addess
  `getBeggars()`
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


### UI Function
#### 1. Admin: 
  NO UI required for Admin, contract functions are invoked from console.
    
#### 2. Giver:
  1. Budget
  	1. Paid requests
  	2. Add fund
    3. Delete fund
  2. Check pending requests
    1. Sort by deadline/time
    2. Pay requests
  3. Dispute
  	1. Edit requests
  
#### 3. Beggar:
  1. Request
    1. List requests
      1. Unpaid
      	1. Remove
      2. Paid
        1. Dispute     
    2. Add request
      
### Data Structure
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

* Account
  * Role
  * Paid Requests

  
### Design rules
* A Beggar's Requests is stored in an array under the Beggar's Account
* Rmoveal of Account/Request requires multi-sig

  
### Vocabulary
* Budget: The sum of all funds
* Fund: Giver's budget
* Request: A payment waiting to be filled by a fund
* Account: An identity associated with an address