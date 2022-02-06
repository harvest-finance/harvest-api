//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUpgradeSource {
  function shouldUpgrade() external view returns (bool, address);
  function finalizeUpgrade() external;
}
