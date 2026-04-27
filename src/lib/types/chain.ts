import type { Chain } from "viem";

export interface ChainConfig {
  id: number;
  name: string;
  shortName: string;
  viemChain: Chain;
  rpcUrls: {
    alchemy?: string;
    public: string[];
  };
  explorerUrl: string;
  explorerApiUrl: string;
  explorerApiKeyEnv?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}
