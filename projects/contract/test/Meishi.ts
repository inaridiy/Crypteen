import { expect } from "chai";
import { SAMPLE_MEISHI, SAMPLE_TICKET } from "./constant";
import { getPrepared, meishiExpect } from "./utils";
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
});
