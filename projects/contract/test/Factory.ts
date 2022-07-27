import { expect } from "chai";
import { deployContracts, findMeishiAddress, getMeishiContract } from "./utils";

describe("CrypteenFactory", () => {
  it("testing create meishi", async () => {
    const { factory } = await deployContracts();
    const tx = await factory.createMeishi("test1", "t1", "uri", false, false);
    const address = await findMeishiAddress(tx);
    expect(Boolean(address)).to.eq(true);
    const meishi = getMeishiContract(address as string);
    console.table(await meishi.meishi());
  });
});
