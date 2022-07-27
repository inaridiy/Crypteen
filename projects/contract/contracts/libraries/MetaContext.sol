// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "../interfaces/IMetaContext.sol";
import "../interfaces/IForwarderPermitter.sol";
import "@openzeppelin/contracts/utils/Context.sol";

abstract contract MetaContext is IMetaContext, Context {
  address private _permitter;

  constructor(address permitter) {
    _permitter = permitter;
  }

  function setPermitter(address permitter) external {
    _permitter = permitter;
  }

  function isTrustedForwarder(address forwarder)
    public
    view
    virtual
    returns (bool)
  {
    return IForwarderPermitter(_permitter).isTrustedForwarder(forwarder);
  }

  function _msgSender()
    internal
    view
    virtual
    override
    returns (address sender)
  {
    if (isTrustedForwarder(msg.sender)) {
      // The assembly code is more direct than the Solidity version using `abi.decode`.
      /// @solidity memory-safe-assembly
      assembly {
        sender := shr(96, calldataload(sub(calldatasize(), 20)))
      }
    } else {
      return super._msgSender();
    }
  }

  function _msgData() internal view virtual override returns (bytes calldata) {
    if (isTrustedForwarder(msg.sender)) {
      return msg.data[:msg.data.length - 20];
    } else {
      return super._msgData();
    }
  }
}
