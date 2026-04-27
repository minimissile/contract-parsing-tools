import { createPublicClient, http, fallback, type PublicClient } from "viem";
import { getChainConfig } from "./config";

const clientCache = new Map<number, PublicClient>();

export function getPublicClient(chainId: number): PublicClient {
  const cached = clientCache.get(chainId);
  if (cached) return cached;

  const config = getChainConfig(chainId);
  if (!config) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const transports = [];

  if (config.rpcUrls.alchemy) {
    const alchemyKey = process.env.ALCHEMY_API_KEY;
    if (alchemyKey) {
      transports.push(http(`${config.rpcUrls.alchemy}/${alchemyKey}`));
    }
  }

  for (const url of config.rpcUrls.public) {
    transports.push(http(url));
  }

  const client = createPublicClient({
    chain: config.viemChain,
    transport: transports.length === 1 ? transports[0] : fallback(transports),
  });

  clientCache.set(chainId, client);
  return client;
}
