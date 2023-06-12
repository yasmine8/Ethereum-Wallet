const { ethers } = require('hardhat');

describe("wallet Test", function () {
  
    before(async function () {
        [this.owner, this.addr1] = await ethers.getSigners();
    });

    it('should deploy the smart contract', async function () {
        console.log(this.addr1.address);
    })

});