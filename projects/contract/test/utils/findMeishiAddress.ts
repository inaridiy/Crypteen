import { ContractTransaction } from "ethers";

export const findMeishiAddress = async (tx: ContractTransaction) => {
  const result = await tx.wait();
  const [_, address] =
    result.events?.find(({ event }) => event === "CreateMeishi")?.args || [];
  return address as string | undefined;
};
