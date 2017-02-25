// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "../stylesheets/modal.css";

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
      self.showBeggarList();
      //self.showAddRequestModal();
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
    } else if (ContractFunctions.isBeggar(myAccount)){
      console.log("You are Beggar");
    }
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

  refreshBeggarRequestList: function (address) {
    return ContractFunctions.refreshBeggarRequestList().then( function () {
      //TODO: show stuff here
    });
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
      table.getElementsByTagName("input")[index].innerHTML = address;
      var cells = table.children[index].children;
      for(var i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = HashColor.hashColor(address, 80+3*i);
      }
      
    });
  },

  showAddRequestModal: function () {       
    var modal = document.getElementById('requestModal');
    modal.style.display = "block";
  },

  addBeggar: function (address, name) {    
    ContractFunctions.addBeggar(address, name).then(function(result) {
      console.log(result);
    }).catch(function(e) {
      console.log(e);
    });
  },

  sendRequest: function () {
    console.log("testssssssssssssssssssssssssssssssss");
  },

  /*Beggar function*/
  addRequest: function (amount, reason, receiptURL) {
    ContractFunctions.addRequest(amount, reason, receiptURL).then(function(result) {
      console.log(result);
    }).catch(function(e) {
      console.log(e);
    });
  },

  /*Giver function*/
  changeRequestStatus: function (targetAddress, requestIndex, toStatus)  
  {
    ContractFunctions.changeRequestStatus(targetAddress, requestIndex, 
      toStatus).then(function(result) {
      console.log(result);
    }).catch(function(e) {
      console.log(e);
    });
  },
  
  /*UI function*/
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
        console.log("NewApproval");
        self.refreshBeggarList();
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


    var requestModal = document.getElementById('requestModal');
    var span = document.getElementsByClassName("close")[0];
    var button = document.getElementsByClassName("formButton")[0];
    span.onclick = function() {
      requestModal.style.display = "none";      
    };

    button.onclick =  function() {
      requestModal.style.display = "none";
      var amount = requestModal.getElementsByClassName("amount")[0].value;
      var reason = requestModal.getElementsByClassName("reason")[0].value;
      self.addRequest(amount, reason, "");
    };

    window.onclick = function(event) {
      if (event.target == requestModal) {
          requestModal.style.display = "none";
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

