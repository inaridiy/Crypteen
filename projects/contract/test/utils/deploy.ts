import { ethers } from "hardhat";
import { CrypteenMeishi__factory } from "../../typechain-types";

export const deployPermitter = async () => {
  const factory = await ethers.getContractFactory("ForwarderPermitter");
  const instance = await factory.deploy();
  await instance.deployed();
  return instance;
};

export const deployFactory = async (permitter: string) => {
  const factory = await ethers.getContractFactory("CrypteenFactory");
  const instance = await factory.deploy(permitter);
  await instance.deployed();
  return instance;
};

export const getMeishiContract = (address: string) => {
  return CrypteenMeishi__factory.connect(address, ethers.provider);
};

export const deployContracts = async () => {
  const permitter = await deployPermitter();
  const factory = await deployFactory(permitter.address);
  return { permitter, factory };
};
