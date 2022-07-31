import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { CrypteenMeishi, ICrypteenMeishi } from "../../typechain-types";

const Ticket = [
  {
    name: "id",
    type: "bytes32",
  },
  {
    name: "expiry",
    type: "uint256",
  },
  {
    name: "amount",
    type: "uint256",
  },
];

export const signTicket = async (
  meishi: CrypteenMeishi,
  author: SignerWithAddress,
  ticket: ICrypteenMeishi.TicketStruct
) => {
  const { chainId } = await ethers.provider.getNetwork();
  return await author._signTypedData(
    {
      name: "CypteenMeishi",
      version: "1",
      chainId,
      verifyingContract: meishi.address,
    },
    {
      Ticket,
    },
    ticket
  );
};
