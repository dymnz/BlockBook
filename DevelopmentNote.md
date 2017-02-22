### Contract Function
#### 1. Admin:
  1. Assign Giver/Beggar status
 
#### 2. Giver:
  1. Pay request
  2. Add fund
  `Budget += Fund`
  3. Delete fund 
  `Budget -= Fund`
  
  4. Edit requst, if the request is "Disputed"

#### 3. Beggar:
  1. Add a request
  2. Delete a request, only request start by Beggar himself
  3. Dispute a request
  
#### 4. UI:
  1. List all requests 
  2. List funds
  3. Show budget


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
  
####3. Beggar:
  1. Request
    1. List requests
      1. Unpaid
      	1. Remove
      2. Paid
        1. Dispute     
    2. Add request
      
### Data Structure
1. Request
  * Amount
  * Reason
  * Photo of the receipt
    1. Google Drive link
    2. Swarm-FUTURE
  * Deadline, if beggar wish to have
  * Status enum{"Pending Approval", "Approved", "Paid", "Disputed"}
2. Fund
  * Amount
  * Reason
3. Account
  * Address
  * Role
  * Paid requests
  * Unpain requests
  
### Storage Structure
1. Requests are stored in two arrays associated with an Account
  
### Vocabulary
* Budget: The sum of all funds
* Fund: Giver's budget
* Request: A payment waiting to be filled by a fund
* Account: An identity associated with an address