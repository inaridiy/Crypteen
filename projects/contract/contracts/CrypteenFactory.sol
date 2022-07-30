// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "./CrypteenMeishi.sol";
import "./interfaces/ICrypteenFactory.sol";
import "./interfaces/ICrypteenMeishi.sol";
import "./libraries/MetaContext.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract CrypteenFactory is ICrypteenFactory, MetaContext {
  mapping(address => mapping(uint256 => address)) public ownedMeishis;
  mapping(address => uint256) public meishiBalances;
  address[] public allMeishis;

  constructor(address permitter) MetaContext(permitter) {}

  function totalSupply() public view returns (uint256) {
    return allMeishis.length;
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

    address meishiAddress = Create2.deploy(
      0,
      keccak256(abi.encode(meishiType)),
      abi.encodePacked(
        type(CrypteenMeishi).creationCode,
        abi.encode(meishiType, _permitter)
      )
    );

    emit CreateMeishi(_msgSender(), meishiAddress);
    uint256 length = meishiBalances[_msgSender()];
    ownedMeishis[_msgSender()][length] = meishiAddress;
    allMeishis.push(meishi);

    return meishiAddress;
  }
}
