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



module.exports = {  
    resetBeggarTable: resetBeggarTable,
    showAddRequestModal: showAddRequestModal,
    showRequestListModal: showRequestListModal,
    resetRequestModal: resetRequestModal,
};