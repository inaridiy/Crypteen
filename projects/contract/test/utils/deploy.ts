import { ethers } from "hardhat";
import { CrypteenMeishi__factory } from "../../typechain-types";

import { CrypteenFactory } from "../../typechain-types";
import { MeishiArg, SAMPLE_MEISHI } from "../constant";
import { findMeishiAddress } from "./findMeishiAddress";

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

export const getSigners = async () => {
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  return { owner, addr1, addr2, addrs };
};

export const deployContracts = async () => {
  const permitter = await deployPermitter();
  const factory = await deployFactory(permitter.address);
  return { permitter, factory };
};

export const deployMeishi = (factory: CrypteenFactory, meishi: MeishiArg) => {
  return getMeishiAddress(factory, meishi).then((address) =>
    CrypteenMeishi__factory.connect(address as string, ethers.provider)
  );
};

export const getMeishiAddress = (
  factory: CrypteenFactory,
  meishi: MeishiArg
) => {
  const { name, symbol, baseURI, isTransferable, isDynamic } = meishi;
  return factory
    .createMeishi(name, symbol, baseURI, isTransferable, isDynamic)
    .then(findMeishiAddress);
};

export const getPrepared = async () => {
  const { permitter, factory } = await deployContracts();
  const meishi = await deployMeishi(factory, SAMPLE_MEISHI);
  const signers = await getSigners();

  return { permitter, factory, meishi, ...signers };
};
