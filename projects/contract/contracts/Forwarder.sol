// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "./interfaces/IForwarder.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract Forwarder is IForwarder, AccessControlEnumerable, Pausable, EIP712 {}
