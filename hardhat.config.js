require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();
require('hardhat-contract-sizer');
 

const bscScanAPIKey = process.env.BSC_SCAN_API_KEY;
const privateKey = process.env.PRIVATE_KEY;
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	defaultNetwork: 'hardhat',
	solidity: {
		compilers: [
			{
				version: '0.8.4',
			}
		],
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: {
			chainId: 1337,
			allowUnlimitedContractSize: true,
		},
		rinkeby: {
			url: `https://rinkeby.infura.io/v3/25284b902dee478ebe9d2bb0821652b2`,
			accounts: [privateKey],
			chainId: 4,
			// gas: 12000000000,
			// blockGasLimit: 0x1fffffffffffff,
			allowUnlimitedContractSize: true,
			// timeout: 1800000,
		},
		bsc: {
			url: `https://bsc-dataseed.binance.org`,
			accounts: [privateKey],
			chainId: 56,
			gas: 'auto',
			gasPrice: 'auto',
		},
		bsctest: {
			url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
			accounts: [privateKey],
			chainId: 97,
			gas: 'auto',
			gasPrice: 'auto',
		},
	},
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://bscscan.com/
		apiKey: bscScanAPIKey,
	},
	contractSizer: {
		alphaSort: true,
		disambiguatePaths: false,
		runOnCompile: true,
	}
};
