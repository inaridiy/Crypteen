interface MeishiArg {
  name: string;
  symbol: string;
  baseURI: string;
  isTransferable: boolean;
  isDynamic: boolean;
}

const SAMPLE_MEISHI: MeishiArg = {
  name: "sample_meishi",
  symbol: "sample",
  baseURI: "ipfs://meishi",
  isTransferable: false,
  isDynamic: false,
};

const SAMPLE_MEISHI2: MeishiArg = {
  name: "sample_meishi2",
  symbol: "sample2",
  baseURI: "ipfs://meishi",
  isTransferable: false,
  isDynamic: false,
};

export { MeishiArg, SAMPLE_MEISHI, SAMPLE_MEISHI2 };
