var ConvertLib = artifacts.require("./ConvertLib.sol");
var BlockBook = artifacts.require("./BlockBook.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, BlockBook);
  deployer.deploy(BlockBook);
};
