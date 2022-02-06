//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IUpgradeSource.sol";
import "./BaseUpgradeabilityProxy.sol";

contract ResolverProxy is BaseUpgradeabilityProxy {

  constructor(address _implementation) {
    _setImplementation(_implementation);
  }

  /**
  * The main logic. If the timer has elapsed and there is a schedule upgrade,
  * the governance can upgrade the resolver
  */
  function upgrade() external {
    (bool should, address newImplementation) = IUpgradeSource(address(this)).shouldUpgrade();
    require(should, "Upgrade not scheduled");
    _upgradeTo(newImplementation);

    // the finalization needs to be executed on itself to update the storage of this proxy
    // it also needs to be invoked by the governance, not by address(this), so delegatecall is needed
    (bool success,) = address(this).delegatecall(
      abi.encodeWithSignature("finalizeUpgrade()")
    );

    require(success, "Issue when finalizing the upgrade");
  }

  function implementation() external view returns (address) {
    return _implementation();
  }
}
