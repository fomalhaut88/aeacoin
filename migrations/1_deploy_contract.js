const AEACoin = artifacts.require("AEACoin")
const Web3 = require('web3')

module.exports = function(deployer) {
  const totalSupply = Web3.utils.toWei('1000000', 'ether')
  deployer.deploy(AEACoin, "AEA Coin Test 2", "AEAC2", totalSupply)
};
