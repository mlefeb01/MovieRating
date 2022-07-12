const Ratings = artifacts.require("./Rating.sol");

// npm i -g ethers
const ethers = require('ethers')
const utils = ethers.utils

module.exports = function(deployer) {
  deployer.deploy(
		Ratings,
		[
			utils.formatBytes32String("Star Wars"), 
			utils.formatBytes32String("Avatar"), 
			utils.formatBytes32String("Inception")
		], 
		{gas: 6700000}
	);
};