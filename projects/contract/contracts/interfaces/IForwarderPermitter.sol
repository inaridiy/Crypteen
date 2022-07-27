// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/IAccessControlEnumerable.sol";

interface IForwarderPermitter is IAccessControlEnumerable {
  function isTrustedForwarder(address forwarder) external view returns (bool);
}
