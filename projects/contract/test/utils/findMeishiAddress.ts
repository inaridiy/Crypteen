import { ContractTransaction } from "ethers";
import { CrypteenFactory__factory } from "../../typechain-types";

export const findMeishiAddress = async (tx: ContractTransaction) => {
  const result = await tx.wait();
  const [_, address] =
    result.events?.find(({ event }) => event === "CreateMeishi")?.args || [];
  return address as string | undefined;
};

export const findMetaTxMeishiAddress = async (tx: ContractTransaction) => {
  const txResult = await tx.wait();
  const result =
    txResult.events
      ?.find(({ event }) => event === "MetaTx")
      ?.args?.slice(-1)[0] || "";
  const [address] =
    CrypteenFactory__factory.createInterface().decodeFunctionResult(
      "createMeishi",
      result
    );
  return address as string;
};
