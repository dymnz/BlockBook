// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import blockBook_artifacts from '../../build/contracts/BlockBook.json'

// The contract entry point
var ContractFunctions = require('./contractFunctions');
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
      self.findMyAccountRole();
    });
    
    

    

    self.addEventListener();    
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
      var table = document.getElementById("beggarTable");
      // Remove table
      table.innerHTML = `        
      <tr class=tableTitle>
            <td>Name</td>
            <td>Requested</td>
            <td>Approved</td>
            <td>Paid</td>
        </tr>`;


      var alignRight = [0, 1, 1, 1];  

      // Construct table
      for (var r = 0 ; r < count; r++)
      {
        beggarTableRows[r] = table.insertRow(-1);   

        for (var c = 0 ; c < 4 ; c++)
        {
          beggarTableRows[r].insertCell(-1); 
          if (alignRight[c]){
            beggarTableRows[r].cells[c].setAttribute('align', 'right');
          }
        }
      }
  },

  refreshGiverInfo: function () {
    return ContractFunctions.refreshGiverInfo().then(function () {
      console.log("refreshGiverInfo done");
    });
  },

  refreshAdminInfo: function () {
    return ContractFunctions.refreshAdminInfo().then(function () {
      console.log("refreshAdminInfo done");
    });
  },

  refreshBeggarList: function () {
    var self = this;
    return ContractFunctions.refreshBeggarAddress().then(function(addresses) {
      self.resetBeggarTable(addresses.length);
      addresses.forEach(function(address, index){
        ContractFunctions.refreshBeggarInfo(address).then(function(beggar) {
          beggarTableRows[index].cells[0].innerHTML = beggar.name;  
          beggarTableRows[index].cells[1].innerHTML = beggar.requested;  
          beggarTableRows[index].cells[2].innerHTML = beggar.approved;  
          beggarTableRows[index].cells[3].innerHTML = beggar.paid;            
        });
      })
      console.log("refreshBeggarList done");
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
    ContractFunctions.roleUpdateEvent().then( function(event){
      event.watch(function(err, result){
        //console.log("RoleUpdate");
        self.refreshBeggarList();
      })
    }).catch(function(e) {
      throw e;
    });  

    // NewApproval event
    ContractFunctions.newApprovalEvent().then( function(event){
      event.watch(function(err, result){
        //console.log("NewApproval");
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
        //console.dir(result);
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
        //console.log("NewPaid");
        self.refreshBeggarList();
        //TODO: self.refreshPaymentPendingList();
      })
    }).catch(function(e) {
      throw e;
    }); 

    // NewDispute event
    ContractFunctions.newDisputeEvent().then( function(event){
      event.watch(function(err, result){
        //console.log("NewPaid");
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
        //console.log("NewPaid");
        self.refreshBeggarList();
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

