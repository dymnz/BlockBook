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

var requestInfo = `
				<div class="requestCell">
                    <div class="info">
                        <div class="amount"></div>
                        <div class="reason"></div>                        
                    </div>
                    <div class="option">
                        <button>Approve</button>
                        <button>Paid</button>
                        <button>Reject</button>
                    </div>
                    <input type="hidden" id="address"/>
                    <input type="hidden" id="requestIndex"/>
                </div>`;

module.exports = {
	beggarInfo: beggarInfo,
	beggarTable: beggarTable,
	requestInfo: requestInfo
}