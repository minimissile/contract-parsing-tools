import type { Abi, Address } from "viem";
import { getChainConfig } from "@/lib/chains/config";

export async function fetchAbiFromExplorer(
  address: Address,
  chainId: number
): Promise<Abi | null> {
  const config = getChainConfig(chainId);
  if (!config) return null;

  const apiKey = config.explorerApiKeyEnv
    ? process.env[config.explorerApiKeyEnv]
    : undefined;

  const params = new URLSearchParams({
    module: "contract",
    action: "getabi",
    address: address,
  });

  if (apiKey) {
    params.set("apikey", apiKey);
  }

  const url = `${config.explorerApiUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (
      data.status === "1" &&
      data.result &&
      data.result !== "Contract source code not verified"
    ) {
      return JSON.parse(data.result) as Abi;
    }
  } catch {
    // Network error or timeout
  }

  return null;
}
