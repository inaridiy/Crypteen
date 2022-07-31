import { ethers } from "hardhat";
import { ICrypteenMeishi } from "../typechain-types";

interface MeishiArg {
  name: string;
  symbol: string;
  baseURI: string;
  isTransferable: boolean;
  isDynamic: boolean;
}

const SAMPLE_MEISHI: MeishiArg = {
  name: "sample_meishi",
  symbol: "sample",
  baseURI: "ipfs://meishi",
  isTransferable: false,
  isDynamic: false,
};

const SAMPLE_MEISHI2: MeishiArg = {
  name: "sample_meishi2",
  symbol: "sample2",
  baseURI: "ipfs://meishi",
  isTransferable: false,
  isDynamic: false,
};

const SAMPLE_TICKET: ICrypteenMeishi.TicketStruct = {
  id: ethers.utils.id("test_ticket"),
  expiry: 1000000000,
  amount: 1000000000,
};

const EIP712Domain = [
  {
    name: "name",
    type: "string",
  },
  {
    name: "version",
    type: "string",
  },
  {
    name: "chainId",
    type: "uint256",
  },
  {
    name: "verifyingContract",
    type: "address",
  },
];

export {
  MeishiArg,
  SAMPLE_MEISHI,
  SAMPLE_MEISHI2,
  SAMPLE_TICKET,
  EIP712Domain,
};
