// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

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
      return self.showBeggarList();
    }).then(function () {
      return self.refreshAdminInfo();
    }).then(function () {
      return self.findMyAccountRole();
    }).then(function () {
      self.addEventListener(); 
    });   


  },

  // setStatus: function(message) {
  //   var status = document.getElementById("status");
  //   status.innerHTML = message;
  // },

  findMyAccountRole: function () {
    var self = this;

    var myAccount = ContractFunctions.getMyAccount();
    if (myAccount = ContractFunctions.getAdminInfo().addr) {

      console.log("You are Admin");
    } else if (myAccount = ContractFunctions.getGiverInfo().addr) {
      console.log("You are Giver");
    } else {
      console.log("TODO: check if myAccount is in beggarList");
    }
    // TODO:
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

  showBeggarList: function () {
    var self = this;
  
    return ContractFunctions.refreshBeggarAddress().then(function(addresses) {
      // Count none "0x0" addresses
      var count = 0;
      var cleanedAddresses = [];
      addresses.forEach(function(address, index) {
        if (address.localeCompare("0x0000000000000000000000000000000000000000"))
          cleanedAddresses.push(address);
      })
      var table = document.getElementById("beggarTable");

      self.resetBeggarTable(cleanedAddresses.length);
      
      cleanedAddresses.forEach(function(address, index){
        var table = document.getElementById("beggarTable");

        ContractFunctions.refreshBeggarInfo(address).then(function(beggar) {
                  
          table.getElementsByClassName("name")[index].innerHTML = beggar.name;
          table.getElementsByClassName("requested")[index].innerHTML = beggar.requested;
          table.getElementsByClassName("approved")[index].innerHTML = beggar.approved;
          table.getElementsByClassName("paid")[index].innerHTML = beggar.paid;

          var cells = table.children[index].children;
          for(var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = HashColor.hashColor(address, 80+3*i);
          }
        });
      })
      console.log(addresses);
    });

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
        self.showBeggarList();
      })
    }).catch(function(e) {
      throw e;
    });  

    // NewApproval event
    ContractFunctions.newApprovalEvent().then( function(event){
      event.watch(function(err, result){
        console.log("NewApproval");
        self.showBeggarList();
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
        self.showBeggarList();
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
        self.showBeggarList();
        //TODO: self.refreshPaymentPendingList();
      })
    }).catch(function(e) {
      throw e;
    }); 

    // NewDispute event
    ContractFunctions.newDisputeEvent().then( function(event){
      event.watch(function(err, result){
        console.log("NewPaid");
        self.showBeggarList();
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
        self.showBeggarList();
        //TODO: self.refreshPaymentPeningList();
        //TODO: self.refreshApprovalPendingList();
        //TODO: self.refreshDisputeList();
      })
    }).catch(function(e) {
      throw e;
    });       
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

