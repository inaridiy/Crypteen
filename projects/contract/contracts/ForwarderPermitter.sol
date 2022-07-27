// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "./interfaces/IForwarderPermitter.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract ForwarderPermitter is IForwarderPermitter, AccessControlEnumerable {
  bytes32 public constant FORWARDER_ROLE = keccak256("FORWARDER_ROLE");

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function isTrustedForwarder(address forwarder) external view returns (bool) {
    return hasRole(FORWARDER_ROLE, forwarder);
  }
}
