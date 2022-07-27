// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "./IMetaContext.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface ICrypteenMeishi is IMetaContext, IERC721Metadata, IERC721Enumerable {
  struct MeishiType {
    address author;
    string name;
    string symbol;
    string baseURI;
    bool isTransferable;
    bool isDynamic;
  }
  struct Ticket {
    bytes32 id;
    uint256 expiry;
    uint256 amount;
  }

  function meishi() external view returns (MeishiType memory);

  function mint(Ticket calldata ticket, bytes calldata signature) external;
}
