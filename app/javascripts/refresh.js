var ContractFunctions = require('./contractFunctions');

var refreshGiverInfo = function () {
  return ContractFunctions.refreshGiverInfo();
};

var refreshAdminInfo = function () {
  return ContractFunctions.refreshAdminInfo();
};

var refreshRequestList = function (address) {
  return ContractFunctions.refreshBeggarRequestList(address);
};

var refreshRequestInfo = function (address, requestIndex) { 
  return ContractFunctions.refreshRequestInfo(address, requestIndex);
};

var refreshBeggarList = function () {
  return ContractFunctions.refreshBeggarAddress().then(function(addresses) {
    addresses.forEach(function(address, index){
      ContractFunctions.refreshBeggarInfo(address);
    })
    console.log(addresses);
  });
};

var refreshRequestInfos = function (address) {
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
};

module.exports = {  
    refreshGiverInfo: refreshGiverInfo,
    refreshAdminInfo: refreshAdminInfo,
    refreshRequestList: refreshRequestList,
    refreshRequestInfo: refreshRequestInfo,
    refreshBeggarList: refreshBeggarList,
    refreshRequestInfos: refreshRequestInfos
};