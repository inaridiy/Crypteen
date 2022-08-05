// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "./interfaces/IForwarder.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "hardhat/console.sol";

contract Forwarder is IForwarder, AccessControlEnumerable, Pausable, EIP712 {
  using ECDSA for bytes32;

  mapping(address => uint256) private _nonces;
  bytes32 private constant TYPEHASH =
    keccak256(
      abi.encodePacked(
        "ForwardRequest(",
        "address from,",
        "address to,",
        "uint256 value,",
        "uint256 gas,",
        "uint256 expiry,",
        "uint256 nonce,",
        "bytes data",
        ")"
      )
    );
  bytes32 public constant EXECUTER_ROLE = keccak256("EXECUTER_ROLE");

  constructor(string memory name_, string memory version_)
    EIP712(name_, version_)
  {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(EXECUTER_ROLE, _msgSender());
  }

  function getNonce(address from) public view returns (uint256) {
    return _nonces[from];
  }

  function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

  function verify(ForwardRequest calldata req, bytes calldata signature)
    public
    view
    returns (bool)
  {
    address signer = _hashTypedDataV4(
      keccak256(
        abi.encode(
          TYPEHASH,
          req.from,
          req.to,
          req.value,
          req.gas,
          req.expiry,
          req.nonce,
          keccak256(req.data)
        )
      )
    ).recover(signature);
    return
      _nonces[req.from] == req.nonce &&
      signer == req.from &&
      block.timestamp < req.expiry;
  }

  function _execute(ForwardRequest calldata req, bytes calldata signature)
    internal
    returns (bool success, bytes memory result)
  {
    require(
      verify(req, signature),
      "Forwarder: signature does not match request"
    );

    _nonces[req.from] += 1;
    (bool _success, bytes memory _result) = req.to.call{
      gas: req.gas,
      value: req.value
    }(abi.encodePacked(req.data, req.from));

    emit MetaTx(
      req.from,
      req.nonce,
      req.to,
      req.value,
      req.gas,
      req.expiry,
      req.data,
      _success,
      _result
    );

    if (gasleft() <= req.gas / 63) {
      assembly {
        invalid()
      }
    }
    return (_success, _result);
  }

  function execute(ForwardRequest calldata req, bytes calldata signature)
    public
    payable
    whenNotPaused
    onlyRole(EXECUTER_ROLE)
    returns (bool success, bytes memory result)
  {
    (bool _success, bytes memory _result) = _execute(req, signature);
    return (_success, _result);
  }

  function executeBatch(
    ForwardRequest[] calldata requests,
    bytes[] calldata signatures
  )
    public
    payable
    whenNotPaused
    onlyRole(EXECUTER_ROLE)
    returns (bool[] memory successes, bytes[] memory results)
  {
    require(
      requests.length == signatures.length && requests.length > 0,
      "Illegal parameter"
    );
    bool[] memory _successes = new bool[](requests.length);
    bytes[] memory _results = new bytes[](requests.length);

    for (uint256 i = 0; i < requests.length; i++) {
      (bool success, bytes memory result) = _execute(
        requests[i],
        signatures[i]
      );
      _successes[i] = success;
      _results[i] = result;
    }

    return (_successes, _results);
  }
}
