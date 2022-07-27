// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

interface IMetaContext {
  function setPermitter(address permitter) external;

  function isTrustedForwarder(address forwarder) external view returns (bool);
}
