// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IResolver.sol";
import "./interfaces/IVault.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IController.sol";
import "./interfaces/AggregatorV3Interface.sol";

import "../node_modules/hardhat/console.sol";

contract DoHardWorkResolver is IResolver {
    // todo: use storage slots
    // todo: use SafeERC20
    // todo: make upgradable with proxy
    // todo: make more universally usable across chains with profitSharingToken etc.
    // todo: getter and setter for priceFeed address, as storage slot

    address internal profitShareTarget = address(0xf00dD244228F51547f0563e60bCa65a30FBF5f7f);
    address internal weth = address(0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619);
    address internal controller = address(0xebaFc813f66c3142E7993a88EE3361a1f4BDaB16);
    uint8 internal greatDealRatio = 6;

    AggregatorV3Interface internal priceFeed;

    constructor() {
        priceFeed = AggregatorV3Interface(address(0x327e23A4855b6F663a28c5161541d69Af8973302));
    }

     function checker(address vault)
        external
        override
        returns (bool canExec, bytes memory execPayload)
    {
        console.log("start.");

        // get farmBalance before
        uint256 profitShareBalanceBefore = IERC20(weth).balanceOf(profitShareTarget);
        // get amount of gas left before
        uint256 gasLeftBefore = gasleft();

        console.log("we in, gas left", gasLeftBefore);
        
        // run doHardWork for vault
        IController(controller).doHardWork(vault);

        console.log("did hard work");

        // approximate tx cost
        // use amount of gas left after to get gas amount which the doHardWork used
        uint256 gasUsed = gasLeftBefore - gasleft();
        console.log("gasUsed\n", gasUsed);
        console.log("tx.gasprice\n", tx.gasprice);
        uint256 gasCost = gasUsed * tx.gasprice;

        console.log("gas cost\n", gasCost);

        // approximate profit sharing gains
        // get farmBalance after
        uint256 profitShareBalanceAfter = IERC20(weth).balanceOf(profitShareTarget);
        uint256 profitShareGainsInEth = profitShareBalanceAfter - profitShareBalanceBefore;

        console.log("profit share gains in ETH\n", profitShareGainsInEth);
        
        // profitShare is in WETH, gasCost is in Matic.
        // we need to compare the two. we use the chainlink oracle price feeds to get the price 
        // for ETH / MATIC
        uint256 priceOneMaticInEth = getLatestPrice(); // uint256(668500000000000);//
        console.log("priceOneMaticInEth\n");
        console.log(priceOneMaticInEth);
        // gas cost is already in matic, let's get the ETH to matic
        // profitShareGainsInEth has 18 decimals, priceOneMaticInEth has 18 decimals
        uint256 profitShareGains = profitShareGainsInEth * 1e18 / priceOneMaticInEth;
        console.log("profit share gains in MATIC\n");
        console.log(profitShareGains);

        console.log("\n\nCOMPARING\n");
        console.log("GAINS:");
        console.log(profitShareGains);
        console.log(gasCost * greatDealRatio);
        console.log("COST * greatDealRatio (ABOVE)");
        console.log("\n\n -------------------- ");

        // check profitability and return false if gains threshold is not surpassed
        if(profitShareGains > gasCost * greatDealRatio) {
            canExec = true;
        } else {
            canExec = false;
        }

        execPayload = abi.encodeWithSelector(
            IController.doHardWork.selector,
            vault
        );
    }

    function doExec(bytes calldata execPayload) external {

    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() internal view returns (uint256) {
        (
            , 
            int256 price,
            ,
            ,
        ) = priceFeed.latestRoundData();
        return uint256(price);
    }
}