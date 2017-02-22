### Contract Function
#### 1. Admin:
  1. Assign Giver/Beggar status
 
#### 2. Giver:
  1. Pay request
  2. Add fund - Budget += Fund.amount
  3. Edit requst, if the request is "Disputed"

  
#### 3. Beggar:
  1. Add a request
  2. Delete a request, only request start by beggar himself
  3. Dispute a request
  
#### 4. UI:
  1. List all requests 
  2. List funds
  3. Show budget



### UI Function
#### 1. Admin: 

#### 2. Giver:
  1. Budget
  	1. Paid requests
  	2. Add fund
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
  1. Amount
  2. Reason
  3. Photo of the receipt
    1. Google Drive link
    2. Swarm-FUTURE
  4. Deadline, if beggar wish to have
  5. Status {"Unpaid", "Paid", "Disputed"}
2. Fund
  1. Amount
  2. Reason

  
  
### Vocabulary
Budget: The sum of all funds
Fund: Giver's budget. 
Request: A payment waiting to be filled by a fund.
