import { expect } from "chai";
import { SAMPLE_MEISHI, SAMPLE_MEISHI2 } from "./constant";
import {
  BNUM,
  deployContracts,
  deploySample,
  getMeishiContract,
  getSigners,
} from "./utils";

describe("CrypteenFactory", () => {
  it("testing create meishi", async () => {
    const { factory } = await deployContracts();
    const { owner } = await getSigners();
    const address = await deploySample(factory, SAMPLE_MEISHI);
    expect(Boolean(address)).is.true;
    const meishi = getMeishiContract(address as string);
    expect((await meishi.meishi()).author).to.equal(owner.address);
  });

  it("testing enumerator", async () => {
    const { factory } = await deployContracts();
    const {
      owner,
      addrs: [addr1],
    } = await getSigners();
    const address1 = await deploySample(factory, SAMPLE_MEISHI);
    const address2 = await deploySample(factory, SAMPLE_MEISHI2);
    const address3 = await deploySample(factory.connect(addr1), SAMPLE_MEISHI);
    console.log(address1, address2, address3);
    expect(await factory.meishiBalances(owner.address)).to.eq(BNUM(2));
    expect(await factory.meishiBalances(addr1.address)).to.eq(BNUM(1));
    expect(await factory.totalSupply()).to.eq(BNUM(3));
    expect(await factory.ownedMeishis(owner.address, 0)).to.eq(address1);
    expect(await factory.ownedMeishis(owner.address, 1)).to.eq(address2);
    expect(await factory.ownedMeishis(addr1.address, 0)).to.eq(address3);
    expect(await factory.allMeishis(0)).to.eq(address1);
    expect(await factory.allMeishis(1)).to.eq(address2);
    expect(await factory.allMeishis(2)).to.eq(address3);
  });
});
