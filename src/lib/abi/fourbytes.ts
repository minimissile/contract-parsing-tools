import type { Hex } from "viem";
import { parseAbiItem, type AbiFunction } from "viem";

const FOURBYTES_API = "https://www.4byte.directory/api/v1/signatures/";

export async function fetchSignatureFrom4Bytes(
  selector: Hex
): Promise<AbiFunction | null> {
  try {
    const url = `${FOURBYTES_API}?hex_signature=${selector}`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (!data.results || data.results.length === 0) return null;

    // Sort by id descending - highest id is usually the most accurate
    const sorted = [...data.results].sort(
      (a: { id: number }, b: { id: number }) => b.id - a.id
    );
    const textSig = sorted[0].text_signature;

    if (!textSig) return null;

    // Parse text signature like "transfer(address,uint256)" into ABI
    const abiItem = parseAbiItem(`function ${textSig}`) as AbiFunction;
    return abiItem;
  } catch {
    // Parse error or network error
  }

  return null;
}
