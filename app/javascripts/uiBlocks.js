var beggarInfo = `
			<div class="beggarInfo">
                <div class="cell name"></div>
                <div class="cell requested number"></div>
                <div class="cell approved number"></div>  
                <div class="cell paid number"></div>              
                <input type="hidden" class="address"/>               
    		</div>`;

var beggarTable = `
	        <div id="beggarTable">
	        </div>`;

var requestInfo = {
    block: 
    `
    <div class="requestInfo">
        <div class="amount cell"></div>
        <div class="other cell">
            <div class="reason"></div>                    
            <div class="option"></div>
        </div>                    
        <input type="hidden" class="address"/>
        <input type="hidden" class="requestIndex"/>
    </div>`,
    innerBlock:
    `
    <div class="amount cell"></div>
    <div class="other cell">
        <div class="reason"></div>                    
        <div class="option"></div>
    </div>                    
    <input type="hidden" class="address"/>
    <input type="hidden" class="requestIndex"/>
    `,
    approvalPendingOptions: 
    `
    <div class="approvalPendingOptions">
        <button class="approve yellow">Approve</button>
        <button class="paid gray">Paid</button>
        <button class="reject red">Reject</button>
    </div>
    `,
    paymentPendingOptions: 
    `
    <div class="paymentPendingOptions">
        <button class="paid gray">Paid</button>
    </div>
    `,    
    disputedOptions: 
    `
    <div class="disputedOptions">
        <button class="approve yellow">Approve</button>
        <button class="paid gray">Paid</button>
    </div>
    `,    


};



module.exports = {
	beggarInfo: beggarInfo,
	beggarTable: beggarTable,
	requestInfo: requestInfo
}