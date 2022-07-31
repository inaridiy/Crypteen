import { expect } from "chai";
import { randomBytes } from "ethers/lib/utils";
import {
  DYNAMIC_MEISHI,
  EXPIRED_TICKET,
  ONETIME_TICKET,
  SAMPLE_MEISHI,
  SAMPLE_TICKET,
} from "./constant";
import { BNUM, getPrepared, meishiExpect } from "./utils";
import { signTicket } from "./verify";

describe("CrypteenMeishi", () => {
  it("Testing of meishi deployments", async () => {
    const { meishi, owner } = await getPrepared();
    await meishiExpect(meishi, owner, SAMPLE_MEISHI);
  });

  it("Testing of verifyTicket", async () => {
    const { meishi, owner } = await getPrepared();
    const signature = await signTicket(meishi, owner, SAMPLE_TICKET);
    expect(await meishi.verifyTicket(SAMPLE_TICKET, signature)).is.true;
  });

  it("Testing of Mint simple", async () => {
    const { meishi, owner, addr1 } = await getPrepared();
    const signature = await signTicket(meishi, owner, SAMPLE_TICKET);
    await meishi.connect(addr1).mint(SAMPLE_TICKET, signature);
    expect(await meishi.balanceOf(addr1.address)).to.eq(BNUM(1));
  });

  it("Testing of expired tickets", async () => {
    const { meishi, owner, addr1 } = await getPrepared();
    const signature = await signTicket(meishi, owner, EXPIRED_TICKET);
    await expect(
      meishi.connect(addr1).mint(EXPIRED_TICKET, signature)
    ).to.rejectedWith("Meishi: Unavailable Tickets");
  });

  it("Testing of out-of-use tickets", async () => {
    const { meishi, owner, addr1, addr2 } = await getPrepared();
    const signature = await signTicket(meishi, owner, ONETIME_TICKET);
    await meishi.connect(addr1).mint(ONETIME_TICKET, signature);
    await expect(
      meishi.connect(addr2).mint(ONETIME_TICKET, signature)
    ).to.rejectedWith("Meishi: Unavailable Tickets");
  });

  it("Testing of used tickets", async () => {
    const { meishi, owner, addr1 } = await getPrepared();
    const signature = await signTicket(meishi, owner, SAMPLE_TICKET);
    await meishi.connect(addr1).mint(SAMPLE_TICKET, signature);
    await expect(
      meishi.connect(addr1).mint(SAMPLE_TICKET, signature)
    ).to.rejectedWith("Meishi: Used tickets");
  });

  it("Testing tickets for incorrect signatures", async () => {
    const { meishi, addr1 } = await getPrepared();
    await expect(
      meishi.connect(addr1).mint(SAMPLE_TICKET, randomBytes(32))
    ).to.rejectedWith("Meishi: Unauthorized signature");
  });

  it("Testing of tokenURI not dynamic", async () => {
    const { meishi, owner, addr1, addr2 } = await getPrepared();
    const signature = await signTicket(meishi, owner, SAMPLE_TICKET);
    await meishi.connect(addr1).mint(SAMPLE_TICKET, signature);
    await meishi.connect(addr2).mint(SAMPLE_TICKET, signature);
    expect(await meishi.tokenURI(0)).is.eq(SAMPLE_MEISHI.baseURI);
    expect(await meishi.tokenURI(1)).is.eq(SAMPLE_MEISHI.baseURI);
  });

  it("Testing of tokenURI dynamic", async () => {
    const { dynamicMeishi, owner, addr1, addr2 } = await getPrepared();
    const { baseURI } = DYNAMIC_MEISHI;
    const signature = await signTicket(dynamicMeishi, owner, SAMPLE_TICKET);
    await dynamicMeishi.connect(addr1).mint(SAMPLE_TICKET, signature);
    await dynamicMeishi.connect(addr2).mint(SAMPLE_TICKET, signature);
    expect(await dynamicMeishi.tokenURI(0)).is.eq(`${baseURI}0`);
    expect(await dynamicMeishi.tokenURI(1)).is.eq(`${baseURI}1`);
  });

  it("Testing of transfers", async () => {
    const { transferableMeishi, meishi, owner, addr1, addr2 } =
      await getPrepared();
    const signature1 = await signTicket(meishi, owner, SAMPLE_TICKET);
    await meishi.connect(addr1).mint(SAMPLE_TICKET, signature1);
    await expect(
      meishi.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
    ).to.rejectedWith("Meishi: Non transferable");

    const signature2 = await signTicket(
      transferableMeishi,
      owner,
      SAMPLE_TICKET
    );
    await transferableMeishi.connect(addr1).mint(SAMPLE_TICKET, signature2);
    await transferableMeishi
      .connect(addr1)
      .transferFrom(addr1.address, addr2.address, 0);
    expect(await transferableMeishi.balanceOf(addr2.address)).to.eq(BNUM(1));
  });
});
