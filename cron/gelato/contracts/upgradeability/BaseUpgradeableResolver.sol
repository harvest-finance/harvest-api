// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./BaseUpgradeableResolverStorage.sol";
import "../base/GovernableInit.sol";

contract BaseUpgradeableResolver is Initializable, GovernableInit, BaseUpgradeableResolverStorage {

  modifier onlyNotPausedTriggering() {
    require(!pausedTriggering(), "Action blocked as the resolver is in emergency state");
    _;
  }

  modifier onlyPokeMe() {
    require(msg.sender == pokeMe(), "Only PokeMe is allowed to call");
    _;
  }

  constructor() BaseUpgradeableResolverStorage() {
  }

  function initialize(
    address _storage,
    address _controller,
    address _profitSharingTarget,
    address _profitSharingToken,
    address _profitSharingTokenToNativePriceFeed,
    address _pokeMe,
    uint8 _greatDealRatio,
    uint256 _implementationChangeDelay
  ) internal {
     GovernableInit.initialize(_storage);

    _setPokeMe(_pokeMe);
    _setController(_controller);
    _setProfitSharingTarget(_profitSharingTarget);
    _setProfitSharingToken(_profitSharingToken);
    _setProfitSharingTokenToNativePriceFeed(_profitSharingTokenToNativePriceFeed);
    _setGreatDealRatio(_greatDealRatio);
    _setNextImplementationDelay(_implementationChangeDelay);
    _setPausedTriggering(false);
  }

  /**
  * Schedules an upgrade for this resolver's proxy.
  */
  function scheduleUpgrade(address impl) public onlyGovernance {
    _setNextImplementation(impl);
    _setNextImplementationTimestamp(block.timestamp + nextImplementationDelay());
  }

  function _finalizeUpgrade() internal {
    _setNextImplementation(address(0));
    _setNextImplementationTimestamp(0);
  }

  function shouldUpgrade() external view returns (bool, address) {
    return (
      nextImplementationTimestamp() != 0
        && block.timestamp > nextImplementationTimestamp()
        && nextImplementation() != address(0),
      nextImplementation()
    );
  }
}
