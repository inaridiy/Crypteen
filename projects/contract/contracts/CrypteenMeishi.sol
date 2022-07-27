// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "./interfaces/ICrypteenMeishi.sol";
import "./libraries/MetaContext.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CrypteenMeishi is
  ICrypteenMeishi,
  ERC721Enumerable,
  MetaContext,
  EIP712
{
  using ECDSA for bytes32;
  using Strings for uint256;

  MeishiType private _meishiType;
  mapping(bytes32 => uint256) internal _numOfTicketsUsed;
  mapping(bytes32 => mapping(address => bool)) internal _ticketUsageHistory;
  bytes32 private constant TYPEHASH =
    keccak256(
      abi.encodePacked(
        "Ticket(",
        "bytes32 id,",
        "uint256 expiry,",
        "uint256 amount",
        ")"
      )
    );

  constructor(MeishiType memory meishiType, address permitter)
    ERC721(meishiType.name, meishiType.symbol)
    MetaContext(permitter)
    EIP712("CypteenMeishi", "0.0.0")
  {
    _meishiType = meishiType;
  }

  function meishi() public view returns (MeishiType memory) {
    return _meishiType;
  }

  function verifyTicket(Ticket calldata ticket, bytes calldata signature)
    public
    view
    returns (bool)
  {
    address signer = _hashTypedDataV4(
      keccak256(abi.encode(TYPEHASH, ticket.id, ticket.expiry, ticket.amount))
    ).recover(signature);
    return signer == _meishiType.author;
  }

  function mint(Ticket calldata ticket, bytes calldata signature) public {
    require(
      block.timestamp < ticket.expiry &&
        _numOfTicketsUsed[ticket.id] < ticket.amount,
      "CrypteenMeishi: Unavailable Tickets"
    );
    require(
      !_ticketUsageHistory[ticket.id][_msgSender()],
      "CrypteenMeishi: Used tickets"
    );
    require(
      verifyTicket(ticket, signature),
      "CrypteenMeishi: Unauthorized signature"
    );

    uint256 newTokenId = totalSupply();
    _numOfTicketsUsed[ticket.id] += 1;
    _ticketUsageHistory[ticket.id][_msgSender()] = true;
    _safeMint(_msgSender(), newTokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, IERC721Metadata)
    returns (string memory)
  {
    if (_meishiType.isDynamic) {
      return string(abi.encodePacked(_meishiType.baseURI, tokenId.toString()));
    } else {
      return _meishiType.baseURI;
    }
  }

  function _beforeTokenTransfer() internal view {
    require(_meishiType.isTransferable, "CrypteenMeishi: Non transferable");
  }

  function _msgSender()
    internal
    view
    override(Context, MetaContext)
    returns (address sender)
  {
    return MetaContext._msgSender();
  }

  function _msgData()
    internal
    view
    override(Context, MetaContext)
    returns (bytes calldata)
  {
    return MetaContext._msgData();
  }
}
