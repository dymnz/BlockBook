### Contract Function
#### 1. Admin:
  1. Assign Giver/Beggar role to an address
  `assignRole(enum Role role, address toAddress)`

#### 2. Giver:
  1. Change Request status

  ```
  changeRequestStatus(address ofAddress, uint RequestID, enum Status toStatus)

  Allowed changes:
  "Pending Approval" -> "Approved"  
  "Approved" -> "Paid"
  "Disputed" -> "Approved"
  "Disputed" -> "Paid"
  ```

  2. Add fund
  `addFund(uint Amount, string Reason)`

  3. Delete fund 
  `deleteFund(uint FundID)`
  

#### 3. Beggar:
  1. Add a request
  `addRequest(uint Amount, string Reason, string URL)`

  2. Delete a request
  `removeRequest(uint RequestID)`

  3. Dispute a request 
  
  ```
  disputeRequest(uint RequestID)

  Allowed change:
  "Paid" -> "Disputed"
  ```
  

#### 4. UI:
  1. List requests
  `getRequests(enum Status ofStatus, address ofAddress)`

  2. List funds
  `getFunds()`

  3. Show budget
  `getBudget()`


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

  
### Storage Structure
* A Beggar's Requests is stored in an array under the Beggar's Account

  
### Vocabulary
* Budget: The sum of all funds
* Fund: Giver's budget
* Request: A payment waiting to be filled by a fund
* Account: An identity associated with an address