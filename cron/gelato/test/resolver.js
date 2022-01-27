
const { impersonates } = require("./utils.js");
// const Resolver = artifacts.require("DoHardWorkResolver");
const IController = artifacts.require("IController");

// use block 23440873 as example for non-profitability (right after deployment of the vault)
// use block 24223199 as example for profitability

// Vanilla Mocha test. Increased compatibility with tools that integrate Mocha.
describe("Harvest Gelato DoHardWorkResolver", () => {
    const governance = "0xf00dD244228F51547f0563e60bCa65a30FBF5f7f";
    const controllerAddress = "0xebaFc813f66c3142E7993a88EE3361a1f4BDaB16";
    let resolver;

    before(async () => {
        // deploy resolver
        accounts = await web3.eth.getAccounts();
        await web3.eth.sendTransaction({ from: accounts[9], to: governance, value: 1e18});

        await impersonates([governance]);

        // use ethers.js because of support for callStatic
        const DoHardWorkResolver = await ethers.getContractFactory("DoHardWorkResolver");
        resolver = await DoHardWorkResolver.deploy();
        await resolver.deployed();

        const controller = await IController.at(controllerAddress);
        await controller.addHardWorker(resolver.address, {from: governance});
    });

    it("should assess profitability correctly", async () => {
        // use ethers.js because of support for callStatic
        await resolver.connect(governance);
        // simulate with 30 GWEI gas price
        const result = await resolver.callStatic.checker("0x13ef392208a9963527346A20873058E826d7f0B7", {gasPrice: 30000000000});
        
        console.log(result);
    });
});