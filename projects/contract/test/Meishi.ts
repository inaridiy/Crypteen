import { getPrepared } from "./utils";

describe("CrypteenMeishi", () => {
  it("Testing of meishi deployments", async () => {
    const { meishi } = await getPrepared();
    console.log(await meishi.meishi());
  });
});
