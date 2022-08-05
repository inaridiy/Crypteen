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

const DYNAMIC_MEISHI: MeishiArg = {
  name: "sample_meishi",
  symbol: "sample",
  baseURI: "ipfs://meishi",
  isTransferable: false,
  isDynamic: true,
};

const TRANSFERABLE_MEISHI: MeishiArg = {
  name: "sample_meishi",
  symbol: "sample",
  baseURI: "ipfs://meishi",
  isTransferable: true,
  isDynamic: false,
};

const SAMPLE_TICKET: ICrypteenMeishi.TicketStruct = {
  id: ethers.utils.id("test_ticket"),
  expiry: (Date.now() / 1000 + 3600) | 0, //現在時刻から1時間後
  amount: 100,
};

const EXPIRED_TICKET: ICrypteenMeishi.TicketStruct = {
  id: ethers.utils.id("test_ticket"),
  expiry: 0, //現在時刻から1時間後
  amount: 100,
};

const ONETIME_TICKET: ICrypteenMeishi.TicketStruct = {
  id: ethers.utils.id("test_ticket"),
  expiry: (Date.now() / 1000 + 3600) | 0, //現在時刻から1時間後
  amount: 1,
};

const FORWARDER_ROLE = ethers.utils.id("FORWARDER_ROLE");
const EXECUTER_ROLE = ethers.utils.id("EXECUTER_ROLE");

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
  DYNAMIC_MEISHI,
  SAMPLE_TICKET,
  EXPIRED_TICKET,
  ONETIME_TICKET,
  TRANSFERABLE_MEISHI,
  FORWARDER_ROLE,
  EXECUTER_ROLE,
  EIP712Domain,
};
