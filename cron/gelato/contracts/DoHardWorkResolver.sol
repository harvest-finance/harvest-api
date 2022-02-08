// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IResolver.sol";
import "./interfaces/IController.sol";
import "./interfaces/AggregatorV3Interface.sol";
import "./upgradeability/BaseUpgradeableResolver.sol";

contract DoHardWorkResolver is Initializable, GovernableInit, BaseUpgradeableResolver, IResolver {
    using SafeERC20 for IERC20;

    constructor() {}

    function initialize(address _storage, 
        address _controller,
        address _profitSharingTarget,
        address _profitSharingToken,
        address _profitSharingTokenToNativePriceFeed,
        address _pokeMe
    ) public initializer {
        BaseUpgradeableResolver.initialize(_storage,
            _controller,
            _profitSharingTarget,
            _profitSharingToken,
            _profitSharingTokenToNativePriceFeed,
            _pokeMe,
            6, // great deal ratio
            12 hours // implementation change delay
        );
    }

    /**
    * Checks the profitability of a doHardWork by comparing gasCost
    * to profitSharing earnings times a greatDealRatio
    * Called by Gelato as trigger for tasks (which trigger doHardWork on a given vault)
    */
    function checker(address vault)
        external
        override
        onlyPokeMe
        onlyNotPausedTriggering
        returns (bool canExec, bytes memory execPayload)
    {
       (uint256 profitSharingGains, uint256 gasCost) = checkDoHardWorkCostVsGain(vault);

        // check profitability and return false if gains threshold is not surpassed
        if(profitSharingGains > gasCost * greatDealRatio()) {
            canExec = true;
        } else {
            canExec = false;
        }

        execPayload = abi.encodeWithSelector(
            IController.doHardWork.selector,
            vault
        );
    }

    /**
    * Sets the ratio that defines the margin for when to trigger a doHardWork on vaults
    */
    function setGreatDealRatio(uint8 greatDealRatio) public onlyGovernance {
        _setGreatDealRatio(greatDealRatio);
    }

    /**
    * Sets the profit sharing token (e.g. WETH on Polygon)
    */
    function setProfitSharingToken(address profitSharingToken) public onlyGovernance {
        _setProfitSharingToken(profitSharingToken);
    }

    /**
    * Sets the controller that triggers doHardWorks on vaults
    */
    function setController(address controller) public onlyGovernance {
        _setController(controller);
    }

    /**
    * Sets the pokeMe whitelisted task execution checker address from gelato
    */
    function setPokeMe(address pokeMe) public onlyGovernance {
        _setPokeMe(pokeMe);
    }

    /**
    * Sets the profit sharing target address
    */
    function setProfitSharingTarget(address profitSharingTarget) public onlyGovernance {
        _setProfitSharingTarget(profitSharingTarget);
    }

    /**
    * Sets the profit sharing token to native token chainlink pricefeed
    * can be found here: https://docs.chain.link/docs/reference-contracts/
    */
    function setProfitSharingTokenToNativePriceFeed(address priceFeed) public onlyGovernance {
        _setProfitSharingTokenToNativePriceFeed(priceFeed);
    }

    /**
    * governance can pause all triggers in an emergency situation
    */
    function setPausedTriggering(bool pausedTriggering) public onlyGovernance {
        _setPausedTriggering(pausedTriggering);
    }

    /**
     * Returns the latest price of the native token / reward token pair
     */
    function getLatestPrice() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(profitSharingTokenToNativePriceFeed());
        (,int256 price,,,) = priceFeed.latestRoundData();
        return uint256(price);
    }

    /** 
     * Gets the balance of the profitSharingToken at the profitSharingTarget
     */
    function getProfitSharingTargetBalance() internal view returns(uint256) {
        return IERC20(profitSharingToken()).balanceOf(profitSharingTarget());
    }

    /** 
     * Executes a doHardWork on the given vault and returns profitSharingGains and gasCost
     */
    function checkDoHardWorkCostVsGain(address vault) internal returns(uint256 profitSharingGains, uint256 gasCost){
         // get farmBalance before
        uint256 profitSharingBalanceBefore = getProfitSharingTargetBalance();
        // get amount of gas left before
        uint256 gasLeftBefore = gasleft();

        // run doHardWork for vault
        IController(controller()).doHardWork(vault);

        // approximate tx cost
        // use amount of gas left after to get gas amount which the doHardWork used
        uint256 gasUsed = gasLeftBefore - gasleft();
        gasCost = gasUsed * tx.gasprice;

        // approximate profit sharing gains
        // get farmBalance after
        uint256 profitSharingBalanceAfter = getProfitSharingTargetBalance();
        uint256 profitSharingGainsInRewardToken = profitSharingBalanceAfter - profitSharingBalanceBefore;

        // profitSharing is in reward token, gasCost is in chain native token.
        // we need to compare the two. we use the chainlink oracle price feeds to get the price
        // for RewardToken / NativeToken
        uint256 priceOneNativeInRewardToken = getLatestPrice();
        // gas cost is already in native token, let's get the reward token to native token
        // profitSharingGainsInRewardToken has 18 decimals, priceOneNativeInRewardToken has 18 decimals
        profitSharingGains = profitSharingGainsInRewardToken * 1e18 / priceOneNativeInRewardToken;
    }
}