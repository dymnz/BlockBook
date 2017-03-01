// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "../stylesheets/request-modal.css";
import "../stylesheets/list-modal.css";
import "../stylesheets/beggarInfo.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import blockBook_artifacts from '../../build/contracts/BlockBook.json'

// The contract entry point
var ContractFunctions = require('./contractFunctions');
var HashColor = require('./hashColor');
var UIBlocks = require('./uiBlocks');

console.log(ContractFunctions);

// Enum
var AccountRole = {
  Admin: 0,
  Giver: 1,
  Beggar: 2
};

// View
var myAccountRole = AccountRole.Beggar;
var beggarTableRows = [];


window.App = {
  start: function() {
    var self = this;

    ContractFunctions.initContract
    (contract(blockBook_artifacts), web3);

    self.refreshGiverInfo().then(function () {
      return self.refreshBeggarList();
    }).then(function () {
      return self.refreshAdminInfo();
    }).then(function () {
      return self.findMyAccountRole();
    }).then(function () {
      return self.addEventListener(); 
    }).then(function () {
      console.log("TODO: Change this to switch statement for different role");

      self.setupRequestModal();
      self.setupRequestListModal();

      self.showGiverDefaultPage();
      //self.showAddRequestModal();
      //self.showRequestListModal();      
    });
  },


  // setStatus: function(message) {
  //   var status = document.getElementById("status");
  //   status.innerHTML = message;
  // },

  findMyAccountRole: function () {
    var self = this;

//TODO:
    var myAccount = ContractFunctions.getMyAccount();
    if (ContractFunctions.isAdmin(myAccount)) {
      console.log("You are Admin");
    } else if (ContractFunctions.isGiver(myAccount)) {
      console.log("You are Giver");
      self.showGiverDefaultPage();
    } else if (ContractFunctions.isBeggar(myAccount)){
      console.log("You are Beggar");
    }
  },

  showGiverDefaultPage: function () {
    var self = this;
    self.showBeggarList();

    //TODO: inject beggar modal
  },

  showBeggarDefaultPage: function () {
    //TODO: inject request modal
  },

  resetBeggarTable: function (count) {
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
  },

  refreshGiverInfo: function () {
    return ContractFunctions.refreshGiverInfo();
  },

  refreshAdminInfo: function () {
    return ContractFunctions.refreshAdminInfo();
  },

  refreshRequestInfos: function (address) {
    var self = this;
    var promises = [];
    var list;
    return ContractFunctions.refreshBeggarRequestList(address).then( function (requestStatusList) {
      list = requestStatusList;
      requestStatusList.forEach(function (status, index) {
        promises.push( self.refreshRequestInfo(address, index) );
      });
      return Promise.all(promises).then(function () {
        ContractFunctions.setBeggarUptodate(address, true);
        return list;
      });
    });
  },

  refreshRequestList: function (address) {
    return ContractFunctions.refreshBeggarRequestList(address);
  },

  refreshRequestInfo: function (address, requestIndex) { 
    return ContractFunctions.refreshRequestInfo(address, requestIndex);
  },

  refreshBeggarList: function () {
    return ContractFunctions.refreshBeggarAddress().then(function(addresses) {
      addresses.forEach(function(address, index){
        ContractFunctions.refreshBeggarInfo(address);
      })
      console.log(addresses);
    });
  },

  showBeggarList: function () {
    var self = this;
  
    var addresses = ContractFunctions.getBeggarAddress();
    
    self.resetBeggarTable(addresses.length);
    var table = document.getElementById("beggarTable");

    addresses.forEach(function(address, index){      
      var beggar = ContractFunctions.getBeggarInfo(address);  

      table.getElementsByClassName("name")[index].innerHTML = beggar.name;
      table.getElementsByClassName("requested")[index].innerHTML = beggar.requested;
      table.getElementsByClassName("approved")[index].innerHTML = beggar.approved;
      table.getElementsByClassName("paid")[index].innerHTML = beggar.paid;
      table.getElementsByClassName("address")[index].value = address;

      // Inject modal showing function
      table.getElementsByClassName("name")[index].addEventListener(
        'click', function () {
        self.showRequestList(address);
      });

      var cells = table.children[index].children;
      for(var i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = HashColor.hashColor(address, 80+3*i);
      }
      
    });
  },

  resetRequestModal: function (title, count) {
      var modal = document.getElementsByClassName("list-modal-content")[0];
      var content = modal.getElementsByClassName("formContent")[0];

      modal.getElementsByClassName("formTitle")[0].innerHTML = title;

      // Remove list
      content.innerHTML = "";

      // Construct list
      for (var r = 0 ; r < count; r++) {
        content.innerHTML += UIBlocks.requestInfo.block;  
      }
  },

  showRequestList: function (address, force) {
    var self = this;
    var infoList = [];
    var statusList = [];
    var beggarInfo;
    if (ContractFunctions.getBeggarUptodate(address) != true || force) {
      self.refreshRequestInfos(address).then(function (sList) {
        statusList = sList;        
        sList.forEach(function (status, index) {
          infoList.push(ContractFunctions.getRequestInfo(address, index));
        });
        beggarInfo = ContractFunctions.getBeggarInfo(address);
        self.resetRequestModal(beggarInfo.name, statusList.length);
        self.populateRequestList(statusList, infoList);
        self.showRequestListModal();
      });
    } else {
      infoList = ContractFunctions.getBeggarInfo(address).requestList;
      statusList = ContractFunctions.getBeggarInfo(address).requestStatusList;
      beggarInfo = ContractFunctions.getBeggarInfo(address);
      self.resetRequestModal(beggarInfo.name, statusList.length);
      self.populateRequestList(statusList, infoList);
      self.showRequestListModal();
    }
  },

  refreshRequestCellInfo: function (cell, info, status) {
    var self = this;

    cell.className = "requestInfo";
    cell.innerHTML = UIBlocks.requestInfo.innerBlock;
    cell.getElementsByClassName("amount")[0].innerHTML 
      = info.amount;
    cell.getElementsByClassName("reason")[0].innerHTML 
      = info.reason;
    cell.getElementsByClassName("address")[0].value 
      = info.addr;
    cell.getElementsByClassName("requestIndex")[0].value 
      = index;

    switch (Number(status)) {
      case ContractFunctions.RequestStatus.PendingApproval:
        cell.getElementsByClassName("option")[0].innerHTML 
          = UIBlocks.requestInfo.approvalPendingOptions;         
        cell.className += " green";
        cell.getElementsByClassName("approve")[0].addEventListener(
          'click', function () {
          cell.getElementsByClassName("option")[0].innerHTML = "Ready to send...";

          // Send transaction
          self.changeRequestStatus(info.addr,
             info.index, ContractFunctions.RequestStatus.Approved)
            .then(function () {
              self.refreshRequestCellInfo(cell, info, ContractFunctions.RequestStatus.Approved);                
             }).catch(function (e) {
              cell.getElementsByClassName("option")[0].innerHTML
                = "Transaction failed.";                 
             });
        });
      break;
      case ContractFunctions.RequestStatus.Approved:
      cell.getElementsByClassName("option")[0].innerHTML 
          = UIBlocks.requestInfo.paymentPendingOptions; 
      cell.className += " yellow";
      break;
      case ContractFunctions.RequestStatus.Disputed:
        cell.getElementsByClassName("option")[0].innerHTML 
          = UIBlocks.requestInfo.disputedOptions; 
        cell.className += " red";
      break;
    }  

  },

  populateRequestList: function (statusList, infoList) {
    var self = this;

    var modal = document.getElementsByClassName("list-modal-content")[0];
    var list = modal.getElementsByClassName("formContent")[0];

    statusList.forEach(function (status, index) {
      var ind = statusList.length - index - 1;
      var cell = list.getElementsByClassName("requestInfo")[ind];

      self.refreshRequestCellInfo(cell, infoList[index], statusList[index]);
    });
  },

  showAddRequestModal: function () {       
    var modal = document.getElementById('requestModal');
    modal.style.display = "block";
  },

  showRequestListModal: function () {       
    var modal = document.getElementById('listModal');
    modal.style.display = "block";
  },


  addBeggar: function (address, name) {    
    ContractFunctions.addBeggar(address, name).then(function(result) {
      console.log(result);
    }).catch(function(e) {
      console.log(e);
    });
  },

  /*Beggar function*/
  addRequest: function (amount, reason, receiptURL) {
    ContractFunctions.addRequest(amount, reason, receiptURL).then(function(result) {
      //console.log("addRequest: " + result);
    }).catch(function(e) {
      console.log(e);
    });
  },

  /*Giver function*/
  changeRequestStatus: function (targetAddress, requestIndex, toStatus)  
  {
    return ContractFunctions.changeRequestStatus(targetAddress, requestIndex, 
      toStatus).then(function(result) {
      console.log("Done" + result);
    });
  },
  
  /*UI function*/
  setupRequestModal: function () { 
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
  },

  setupRequestListModal: function () {
    var self = this;

    var listModal = document.getElementById('listModal');
    var span = listModal.getElementsByClassName("close")[0];
    span.onclick = function() {
      listModal.style.display = "none";      
    };
  },

  addEventListener: function () {
    var self = this;

    // RoleUpdate event
    ContractFunctions.roleUpdateEvent({}, {from: 'latest', to: 'latest'}).then( function(event){
      event.watch(function(err, result){
        console.log("RoleUpdate");
        self.refreshBeggarList();
      })
    }).catch(function(e) {
      throw e;
    });  

    // NewApproval event
    ContractFunctions.newApprovalEvent().then( function(event){
      event.watch(function(err, result){
        self.refreshBeggarList();
        //self.showRequestList(result.args._beggarAddress);
        //TODO: self.refreshApprovalPeningList();
        //TODO: self.refreshPaymentPeningList();
      })
    }).catch(function(e) {
      throw e;
    }); 

    // NewRequest event
    ContractFunctions.newRequestEvent().then( function(event){
      event.watch(function(err, result){
        console.log("NewRequest: " + result.args._beggarAddress);
        self.refreshBeggarList();
        //TODO: self.refreshApprovalPeningList();
        //TODO: self.refreshPaymentPeningList();
      })
    }).catch(function(e) {
      throw e;
    }); 

    // NewPaid event
    ContractFunctions.newPaidEvent().then( function(event){
      event.watch(function(err, result){
        console.log("NewPaid");
        self.refreshBeggarList();
        //TODO: self.refreshPaymentPendingList();
      })
    }).catch(function(e) {
      throw e;
    }); 

    // NewDispute event
    ContractFunctions.newDisputeEvent().then( function(event){
      event.watch(function(err, result){
        console.log("NewPaid");
        self.refreshBeggarList();
        //TODO: self.refreshPaymentPendingList();
        //TODO: self.refreshApprovalPendingList();
        //TODO: self.refreshDisputeList();
      })
    }).catch(function(e) {
      throw e;
    });     

    //  DisputeResolved event
    ContractFunctions.disputeResolvedEvent().then( function(event){
      event.watch(function(err, result){
        console.log("NewPaid");
        self.refreshBeggarList();
        //TODO: self.refreshPaymentPeningList();
        //TODO: self.refreshApprovalPendingList();
        //TODO: self.refreshDisputeList();
      })
    }).catch(function(e) {
      throw e;
    });     

    window.onclick = function(event) {
      var requestModal = document.getElementById('requestModal');
      var listModal = document.getElementById('listModal');    
      if (event.target == requestModal) {
          requestModal.style.display = "none";
      } else if (event.target == listModal) {
        listModal.style.display = "none";
      }
    };
  
  }

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }



  App.start();
});

