var BlockBook = artifacts.require("./BlockBook.sol");

module.exports = function(deployer) {
  deployer.deploy(BlockBook);
};
