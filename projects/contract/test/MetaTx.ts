import { ethers } from "hardhat";
import { IForwarder } from "../typechain-types";
import { SAMPLE_MEISHI } from "./constant";
import { getPrepared } from "./utils";
import { signMetaTx } from "./verify";

describe("MetaTx", () => {
  it("create meishi with metaTx", async () => {
    const { forwarder, owner, factory, meishi, addr1 } = await getPrepared();
    const request: IForwarder.ForwardRequestStruct = {
      from: addr1.address,
      to: meishi.address,
      value: 0,
      gas: 100000000,
      expiry: (await ethers.provider.getBlock("latest")).timestamp + 100,
      nonce: (await forwarder.getNonce(addr1.address)).toNumber(),
      data: factory.interface.encodeFunctionData(
        "createMeishi" as any,
        Object.values(SAMPLE_MEISHI) as any
      ),
    };

    const signature = await signMetaTx(forwarder, addr1, request);
    const tx = await forwarder.connect(owner).execute(request, signature);
    const yeah = await tx.wait();
    console.log(yeah.events?.[0]);
  });
});
