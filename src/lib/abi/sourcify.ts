import type { Abi, Address } from "viem";

const SOURCIFY_BASE = "https://repo.sourcify.dev/contracts";

async function tryFetchSourcify(
  matchType: "full_match" | "partial_match",
  chainId: number,
  address: Address
): Promise<Abi | null> {
  const url = `${SOURCIFY_BASE}/${matchType}/${chainId}/${address}/metadata.json`;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const metadata = await response.json();
    if (metadata?.output?.abi) {
      return metadata.output.abi as Abi;
    }
  } catch {
    // Network error or timeout
  }

  return null;
}

export async function fetchAbiFromSourcify(
  address: Address,
  chainId: number
): Promise<Abi | null> {
  // Try full match first, then partial
  const fullMatch = await tryFetchSourcify("full_match", chainId, address);
  if (fullMatch) return fullMatch;

  return tryFetchSourcify("partial_match", chainId, address);
}
