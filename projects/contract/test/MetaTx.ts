import { expect } from "chai";
import { ethers } from "hardhat";
import { CrypteenMeishi__factory, IForwarder } from "../typechain-types";
import { SAMPLE_MEISHI2 } from "./constant";
import { findMetaTxMeishiAddress, getPrepared } from "./utils";
import { signMetaTx } from "./verify";

describe("MetaTx", () => {
  it("create meishi with metaTx", async () => {
    const { forwarder, owner, factory, addr1 } = await getPrepared();
    const request: IForwarder.ForwardRequestStruct = {
      from: addr1.address,
      to: factory.address,
      value: 0,
      gas: 100000000,
      expiry: (await ethers.provider.getBlock("latest")).timestamp + 100,
      nonce: (await forwarder.getNonce(addr1.address)).toNumber(),
      data: factory.interface.encodeFunctionData(
        "createMeishi",
        Object.values(SAMPLE_MEISHI2) as any
      ),
    };

    const signature = await signMetaTx(forwarder, addr1, request);
    const tx = await forwarder.connect(owner).execute(request, signature);
    const meishi = CrypteenMeishi__factory.connect(
      await findMetaTxMeishiAddress(tx),
      ethers.provider
    );
    expect((await meishi.meishi()).author).to.be(addr1.address);
  });
});
