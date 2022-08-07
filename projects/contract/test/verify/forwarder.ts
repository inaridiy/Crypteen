import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Forwarder, IForwarder } from "../../typechain-types";

export const ForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
  { name: "validUntilTime", type: "uint256" },
];

export const signMetaTx = async (
  forwarder: Forwarder,
  author: SignerWithAddress,
  request: IForwarder.ForwardRequestStruct
) => {
  const { chainId } = await ethers.provider.getNetwork();
  return await author._signTypedData(
    {
      name: "SampleForwarder",
      version: "1",
      chainId,
      verifyingContract: forwarder.address,
    },
    {
      ForwardRequest,
    },
    request
  );
};
