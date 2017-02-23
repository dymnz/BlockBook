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

// View
var beggarTableRows = [];

window.App = {
  start: function() {
    ContractFunctions.initContract(contract(blockBook_artifacts), web3);
  },

  // setStatus: function(message) {
  //   var status = document.getElementById("status");
  //   status.innerHTML = message;
  // },

  refreshBalance: function() {
    this.listBalance();
  },

  // Get balance in each account and update
  listBalance: function () {
    var self = this;
  },
  resetBeggarTable: function (count) {

      var table = document.getElementById("beggarTable");
      // Remove table
      table.innerHTML = "";

      // Add title
      var row = table.insertRow(0);  
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = "Address";
      cell2.innerHTML = "Balance";
      cell2.setAttribute("align", "right");

      // Construct table
      for (var i = 0 ; i < count; i++)
      {
        beggarTableRows[i] = table.insertRow(-1);   
        beggarTableRows[i].insertCell(0);
        beggarTableRows[i].insertCell(1);

        beggarTableRows[i].cells[1].setAttribute("align", "right");
      }
  },

  refreshBeggarList: function () {
    var self = this;

    ContractFunctions.getBeggarList().then(function(addresses) {
      self.resetBeggarTable(addresses.length);
      addresses.forEach(function(address, index){
        beggarTableRows[index].cells[0].innerHTML = address;
      })
      console.log(addresses);
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

