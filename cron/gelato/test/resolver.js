const assert = require('assert')
const { impersonates } = require("./utils.js");
const Storage = artifacts.require("Storage");
const DoHardWorkResolver = artifacts.require("DoHardWorkResolver");
const ResolverProxy = artifacts.require("ResolverProxy");
const IController = artifacts.require("IController");

// use block 23880727 as example for non-profitability
// use block 24223199 as example for profitability

const nonProfitableBlockNumber = 23880727;
const profitableBlockNumber = 24223199;

// Vanilla Mocha test. Increased compatibility with tools that integrate Mocha.
describe("Harvest Gelato DoHardWorkResolver", () => {
    const governance = "0xf00dD244228F51547f0563e60bCa65a30FBF5f7f";
    const controllerAddress = "0xebaFc813f66c3142E7993a88EE3361a1f4BDaB16";
    const priceFeedAddress = "0x327e23A4855b6F663a28c5161541d69Af8973302";
    const wethProfitSharingToken = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
    const profitSharingTarget = "0xf00dD244228F51547f0563e60bCa65a30FBF5f7f";

    // for this test we use governance as pokeMeAddress. 
    // We don't have to test Gelato internals - we have to test our resolver.
    const pokeMeAddress = governance;

    let resolver;
    let resolverProxy;
    let resolverImplementation;

    // the test behaves differently depending on the initial block number.
    // it checks for correct should trigger if block is 24223199
    // and it checks for correct non-trigger if block is 23880727
    let initialBlockNumber;

    before(async () => {
        initialBlockNumber = await web3.eth.getBlockNumber();
        if(initialBlockNumber !== profitableBlockNumber && initialBlockNumber !== nonProfitableBlockNumber){
            console.warn("\n\n -------- \nNon supported block number test case! Please check profitability yourself!\n-------\n\n");
        }
        
        accounts = await web3.eth.getAccounts();
        await web3.eth.sendTransaction({ from: accounts[9], to: governance, value: 1e18});

        await impersonates([governance]);

        await initializeResolver();

        // whitelist deployed resolver as hardWorker at controller
        const controller = await IController.at(controllerAddress);
        await controller.addHardWorker(resolver.address, {from: governance});
    });

    it("should assess profitability correctly", async () => {
        // use ethers.js because of support for callStatic
        // simulate with 30 GWEI gas price
        const result = await resolver.connect(governance).callStatic.checker(
            "0x13ef392208a9963527346A20873058E826d7f0B7", 
            {gasPrice: 30000000000}
        );

        console.log("\n\n----- Transaction result: -----\n", result);

        if(initialBlockNumber === profitableBlockNumber) {
            assert(result['canExec'] === true, "ERROR: Profitability not detected (when it should)!");
            console.log("\n\nSuccess: Protifability detected correctly!");
        } else if(initialBlockNumber === nonProfitableBlockNumber) {
            assert(result['canExec'] === false, "ERROR: Non-Profitability not detected (when it should)!");
            console.log("\n\nSuccess: Non-Protifability detected correctly!");
        } else {
            console.warn("\n\n -------- \nNon supported block number test case! Please check profitability yourself!\n-------\n\n");
            assert(true === false, "Not supported test case");
        }
    });

    const initializeResolver = async () => {
        console.log("intiializing resolver")
        // deploy resolvers storage
        const storage = await Storage.new({from: governance});

        // deploy resolver implementation
        resolverImplementation = await DoHardWorkResolver.new(); 

        // deploy resolver proxy and link to implementation
        resolverProxy = await ResolverProxy.new(resolverImplementation.address);

        const DoHardWorkResolverEthers = await ethers.getContractFactory("DoHardWorkResolver");
        resolver = await DoHardWorkResolverEthers.attach(resolverProxy.address);

        await resolver.connect(governance);

        // initialize resolver
        await resolver.initialize(
            storage.address, 
            controllerAddress,
            profitSharingTarget,
            wethProfitSharingToken,
            priceFeedAddress, 
            pokeMeAddress);
    }
});