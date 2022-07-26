// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/IAccessControl.sol";

interface IForwarder is IAccessControl {
  struct ForwardRequest {
    address from;
    address to;
    uint256 value;
    uint256 gas;
    uint256 expiry;
    uint256 nonce;
    bytes data;
  }

  function getNonce(address from) external view returns (uint256);

  function pause() external;

  function unpause() external;

  function verify(ForwardRequest calldata req, bytes calldata signature)
    external
    view
    returns (bool);

  function execute(ForwardRequest calldata req, bytes calldata signature)
    external
    payable
    returns (bool success, bytes memory result);

  function executeBatch(
    ForwardRequest[] calldata requests,
    bytes[] calldata signatures
  ) external payable returns (bool[] memory successes, bytes[] memory results);
}
