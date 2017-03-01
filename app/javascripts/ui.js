var UIBlocks = require('./uiBlocks');

var resetBeggarTable = function (count) {
    // Initialize content with table
    var content = document.getElementById("content");
    content.innerHTML = UIBlocks.beggarTable;

    var table = document.getElementById("beggarTable");
    // Remove table
    table.innerHTML = "";

    // Construct table
    for (var r = 0 ; r < count; r++)
    {
      table.innerHTML += UIBlocks.beggarInfo;   
    }
};

var resetRequestModal = function (title, count) {
    var modal = document.getElementsByClassName("list-modal-content")[0];
    var content = modal.getElementsByClassName("formContent")[0];

    modal.getElementsByClassName("formTitle")[0].innerHTML = title;

    // Remove list
    content.innerHTML = "";

    // Construct list
    for (var r = 0 ; r < count; r++) {
        content.innerHTML += UIBlocks.requestInfo.block;  
    }
};

var showAddRequestModal = function () {       
    var modal = document.getElementById('requestModal');
    modal.style.display = "block";
};

var showRequestListModal = function () {       
    var modal = document.getElementById('listModal');
    modal.style.display = "block";
};

var setupRequestModal = function () { 
    var self = this;

    var requestModal = document.getElementById('requestModal');
    var close = requestModal.getElementsByClassName("close")[0];
    var button = requestModal.getElementsByClassName("formButton")[0];
    var status = requestModal.getElementsByClassName("status")[0];
    close.onclick = function() {
      requestModal.style.display = "none";      
    };

    button.onclick =  function() {
        var amount = requestModal.getElementsByClassName("amount")[0].value;
        var reason = requestModal.getElementsByClassName("reason")[0].value;

        if (amount <= 0) {
            status.innerHTML = "Amount needs to be larger than 0";
        } else {
            self.addRequest(amount, reason, "");  
            requestModal.style.display = "none";
        }      
    };
};

var setupRequestListModal = function () {
    var self = this;

    var listModal = document.getElementById('listModal');
    var span = listModal.getElementsByClassName("close")[0];
    span.onclick = function() {
        listModal.style.display = "none";      
    };
};


module.exports = {  
    resetBeggarTable: resetBeggarTable,
    showAddRequestModal: showAddRequestModal,
    showRequestListModal: showRequestListModal,
    resetRequestModal: resetRequestModal,
    setupRequestModal: setupRequestModal,
    setupRequestListModal: setupRequestListModal,
};