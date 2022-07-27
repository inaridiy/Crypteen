// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

interface ICrypteenFactory {
  event CreateMeishi(address indexed from, address meishi);

  function createMeishi(
    string calldata name,
    string calldata symbol,
    string calldata baseURI,
    bool isTransferable,
    bool isDynamic
  ) external returns (address meishi);
}
