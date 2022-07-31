import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { CrypteenMeishi } from "../../typechain-types";
import { MeishiArg } from "../constant";

export const meishiExpect = async (
  meishi: CrypteenMeishi,
  author: SignerWithAddress,
  meishiType: MeishiArg
) => {
  expect([...(await meishi.meishi())]).to.have.members([
    author.address,
    ...Object.values(meishiType),
  ]);
};
