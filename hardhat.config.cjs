//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const API_KEY = process.env.API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY  || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: './src/artifacts',
  },
  networks:{
    sepolia: {
      url : API_KEY,
      accounts : [PRIVATE_KEY],
    },
  }
};
