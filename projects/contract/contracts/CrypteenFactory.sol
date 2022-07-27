// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "./interfaces/ICrypteenFactory.sol";
import "./interfaces/ICrypteenMeishi.sol";
import "./libraries/MetaContext.sol";
import "./CrypteenMeishi.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "hardhat/console.sol";

contract CrypteenFactory is ICrypteenFactory, MetaContext {
  constructor(address permitter) MetaContext(permitter) {}

  function meishiHash(ICrypteenMeishi.MeishiType memory meishi)
    public
    pure
    returns (bytes32 hash)
  {
    return
      keccak256(
        abi.encodePacked(
          meishi.author,
          meishi.name,
          meishi.symbol,
          meishi.baseURI,
          meishi.isTransferable,
          meishi.isDynamic
        )
      );
  }

  function createMeishi(
    string calldata name,
    string calldata symbol,
    string calldata baseURI,
    bool isTransferable,
    bool isDynamic
  ) public returns (address meishi) {
    ICrypteenMeishi.MeishiType memory meishiType = ICrypteenMeishi.MeishiType(
      _msgSender(),
      name,
      symbol,
      baseURI,
      isTransferable,
      isDynamic
    );

    bytes memory contractByteCode = type(CrypteenMeishi).creationCode;
    bytes memory initializeCode = abi.encode(meishiType, _permitter);

    address meishiAddress = Create2.deploy(
      0,
      meishiHash(meishiType),
      abi.encodePacked(contractByteCode, initializeCode)
    );
    emit CreateMeishi(_msgSender(), meishiAddress);
    return meishiAddress;
  }
}
