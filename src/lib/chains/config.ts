import {
  mainnet,
  bsc,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
} from "viem/chains";
import type { ChainConfig } from "@/lib/types/chain";

export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  1: {
    id: 1,
    name: "Ethereum",
    shortName: "ETH",
    viemChain: mainnet,
    rpcUrls: {
      alchemy: "https://eth-mainnet.g.alchemy.com/v2",
      public: ["https://eth.llamarpc.com", "https://rpc.ankr.com/eth"],
    },
    explorerUrl: "https://etherscan.io",
    explorerApiUrl: "https://api.etherscan.io/api",
    explorerApiKeyEnv: "ETHERSCAN_API_KEY",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  56: {
    id: 56,
    name: "BNB Smart Chain",
    shortName: "BSC",
    viemChain: bsc,
    rpcUrls: {
      public: [
        "https://bsc-dataseed.binance.org",
        "https://rpc.ankr.com/bsc",
      ],
    },
    explorerUrl: "https://bscscan.com",
    explorerApiUrl: "https://api.bscscan.com/api",
    explorerApiKeyEnv: "BSCSCAN_API_KEY",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  },
  137: {
    id: 137,
    name: "Polygon",
    shortName: "MATIC",
    viemChain: polygon,
    rpcUrls: {
      alchemy: "https://polygon-mainnet.g.alchemy.com/v2",
      public: [
        "https://polygon-rpc.com",
        "https://rpc.ankr.com/polygon",
      ],
    },
    explorerUrl: "https://polygonscan.com",
    explorerApiUrl: "https://api.polygonscan.com/api",
    explorerApiKeyEnv: "POLYGONSCAN_API_KEY",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  },
  42161: {
    id: 42161,
    name: "Arbitrum One",
    shortName: "ARB",
    viemChain: arbitrum,
    rpcUrls: {
      alchemy: "https://arb-mainnet.g.alchemy.com/v2",
      public: [
        "https://arb1.arbitrum.io/rpc",
        "https://rpc.ankr.com/arbitrum",
      ],
    },
    explorerUrl: "https://arbiscan.io",
    explorerApiUrl: "https://api.arbiscan.io/api",
    explorerApiKeyEnv: "ARBISCAN_API_KEY",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  10: {
    id: 10,
    name: "Optimism",
    shortName: "OP",
    viemChain: optimism,
    rpcUrls: {
      alchemy: "https://opt-mainnet.g.alchemy.com/v2",
      public: [
        "https://mainnet.optimism.io",
        "https://rpc.ankr.com/optimism",
      ],
    },
    explorerUrl: "https://optimistic.etherscan.io",
    explorerApiUrl: "https://api-optimistic.etherscan.io/api",
    explorerApiKeyEnv: "OPTIMISM_ETHERSCAN_API_KEY",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  8453: {
    id: 8453,
    name: "Base",
    shortName: "BASE",
    viemChain: base,
    rpcUrls: {
      alchemy: "https://base-mainnet.g.alchemy.com/v2",
      public: [
        "https://mainnet.base.org",
        "https://rpc.ankr.com/base",
      ],
    },
    explorerUrl: "https://basescan.org",
    explorerApiUrl: "https://api.basescan.org/api",
    explorerApiKeyEnv: "BASESCAN_API_KEY",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  43114: {
    id: 43114,
    name: "Avalanche C-Chain",
    shortName: "AVAX",
    viemChain: avalanche,
    rpcUrls: {
      public: [
        "https://api.avax.network/ext/bc/C/rpc",
        "https://rpc.ankr.com/avalanche",
      ],
    },
    explorerUrl: "https://snowtrace.io",
    explorerApiUrl: "https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api",
    explorerApiKeyEnv: "SNOWTRACE_API_KEY",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
  },
};

export function getChainConfig(chainId: number): ChainConfig | undefined {
  return CHAIN_CONFIGS[chainId];
}

export function getSupportedChains(): ChainConfig[] {
  return Object.values(CHAIN_CONFIGS).sort((a, b) => {
    const order = [1, 42161, 10, 8453, 137, 56, 43114];
    return order.indexOf(a.id) - order.indexOf(b.id);
  });
}

export function getSupportedChainIds(): number[] {
  return Object.keys(CHAIN_CONFIGS).map(Number);
}
