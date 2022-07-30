// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "./IMetaContext.sol";
import "./ICrypteenMeishi.sol";

interface ICrypteenFactory is IMetaContext {
  event CreateMeishi(address indexed from, address meishi);

  function totalSupply() external view returns (uint256);

  function ownedMeishis(address owner, uint256 index)
    external
    view
    returns (address);

  function meishiBalances(address owner) external view returns (uint256);

  function allMeishis(uint256 index) external view returns (address);

  function createMeishi(
    string calldata name,
    string calldata symbol,
    string calldata baseURI,
    bool isTransferable,
    bool isDynamic
  ) external returns (address meishi);
}
