import type { Abi, Address, Hash, Hex } from "viem";

export type AbiSource =
  | "etherscan"
  | "sourcify"
  | "4bytes"
  | "manual"
  | "none";

export interface AbiResolution {
  abi: Abi | null;
  source: AbiSource;
  partial: boolean;
}

export interface ProxyInfo {
  isProxy: boolean;
  implementationAddress: Address | null;
}

export interface RawTransactionData {
  hash: Hash;
  from: Address;
  to: Address | null;
  input: Hex;
  value: bigint;
  nonce: number;
  gas: bigint;
  gasPrice: bigint | undefined;
  maxFeePerGas: bigint | undefined;
  maxPriorityFeePerGas: bigint | undefined;
  // receipt
  status: "success" | "reverted";
  gasUsed: bigint;
  effectiveGasPrice: bigint;
  blockNumber: bigint;
  contractAddress: Address | null;
  // block
  timestamp: bigint;
}

export interface DecodedParam {
  name: string;
  type: string;
  value: string | string[] | Record<string, unknown>;
  rawHex?: string;
  formattedValue?: string;
  components?: DecodedParam[];
}

export interface DecodedCalldata {
  functionName: string;
  functionSignature: string;
  selector: Hex;
  params: DecodedParam[];
}

export interface ParsedTransaction {
  txHash: Hash;
  chainId: number;
  chainName: string;
  from: string;
  to: string | null;
  value: string;
  gasUsed: string;
  gasPrice: string;
  effectiveGasPrice: string;
  status: "success" | "reverted";
  blockNumber: number;
  timestamp: number;
  nonce: number;
  isContractCreation: boolean;
  contractAddress: string | null;
  decoded: DecodedCalldata | null;
  abiInfo: {
    source: AbiSource;
    partial: boolean;
    proxyDetected: boolean;
    implementationAddress: string | null;
  };
  rawInput: string;
  explorerUrl: string;
}
