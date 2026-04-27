import type { Abi, Address, Hex } from "viem";
import { detectProxy } from "./proxy-detector";
import { fetchAbiFromExplorer } from "./etherscan";
import { fetchAbiFromSourcify } from "./sourcify";
import { fetchSignatureFrom4Bytes } from "./fourbytes";
import type { AbiResolution, AbiSource, ProxyInfo } from "@/lib/types/transaction";

export interface ResolveResult {
  abiResolution: AbiResolution;
  proxyInfo: ProxyInfo;
}

export async function resolveAbi(
  contractAddress: Address,
  chainId: number,
  calldata: Hex
): Promise<ResolveResult> {
  // Step 0: Detect if this is a proxy contract
  const proxyInfo = await detectProxy(contractAddress, chainId);
  const targetAddress = proxyInfo.implementationAddress ?? contractAddress;

  // Step 1: Try block explorer (Etherscan-compatible)
  const explorerAbi = await fetchAbiFromExplorer(targetAddress, chainId);
  if (explorerAbi) {
    return {
      abiResolution: { abi: explorerAbi, source: "etherscan", partial: false },
      proxyInfo,
    };
  }

  // If proxy detected and explorer failed for implementation, try the proxy address itself
  if (proxyInfo.isProxy) {
    const proxyAbi = await fetchAbiFromExplorer(contractAddress, chainId);
    if (proxyAbi) {
      return {
        abiResolution: { abi: proxyAbi, source: "etherscan", partial: false },
        proxyInfo,
      };
    }
  }

  // Step 2: Try Sourcify
  const sourcifyAbi = await fetchAbiFromSourcify(targetAddress, chainId);
  if (sourcifyAbi) {
    return {
      abiResolution: { abi: sourcifyAbi, source: "sourcify", partial: false },
      proxyInfo,
    };
  }

  // Step 3: Try 4bytes signature database (partial - no param names)
  if (calldata && calldata.length >= 10) {
    const selector = calldata.slice(0, 10) as Hex;
    const abiFunction = await fetchSignatureFrom4Bytes(selector);
    if (abiFunction) {
      const partialAbi: Abi = [abiFunction];
      return {
        abiResolution: { abi: partialAbi, source: "4bytes" as AbiSource, partial: true },
        proxyInfo,
      };
    }
  }

  // Step 4: No ABI found
  return {
    abiResolution: { abi: null, source: "none", partial: false },
    proxyInfo,
  };
}
