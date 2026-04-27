import { NextResponse } from "next/server";
import { z } from "zod/v4";
import type { Hash, Hex, Abi, Address } from "viem";
import { fetchTransactionData } from "@/lib/decoder/transaction";
import { decodeCalldata } from "@/lib/decoder/calldata";
import { resolveAbi } from "@/lib/abi/resolver";
import { getChainConfig, getSupportedChainIds } from "@/lib/chains/config";
import {
  InvalidInputError,
  TransactionNotFoundError,
  DecodeError,
  RpcError,
} from "@/lib/errors";
import type { ParsedTransaction, DecodedCalldata } from "@/lib/types/transaction";

const requestSchema = z.object({
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash format"),
  chainId: z.number().int().positive(),
  manualAbi: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: parsed.error.issues[0]?.message ?? "Invalid input",
          },
        },
        { status: 400 }
      );
    }

    const { txHash, chainId, manualAbi } = parsed.data;

    // Validate chain
    const supportedChainIds = getSupportedChainIds();
    if (!supportedChainIds.includes(chainId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNSUPPORTED_CHAIN",
            message: `Chain ID ${chainId} is not supported`,
          },
        },
        { status: 400 }
      );
    }

    const chainConfig = getChainConfig(chainId)!;

    // Fetch transaction data
    const rawTx = await fetchTransactionData(txHash as Hash, chainId);

    // Handle contract creation transactions
    const isContractCreation = rawTx.to === null;

    let decoded: DecodedCalldata | null = null;
    let abiSource: "etherscan" | "sourcify" | "4bytes" | "manual" | "none" = "none";
    let abiPartial = false;
    let proxyDetected = false;
    let implementationAddress: string | null = null;

    if (!isContractCreation && rawTx.to && rawTx.input && rawTx.input !== "0x") {
      // Parse manual ABI if provided
      let manualAbiParsed: Abi | undefined;
      if (manualAbi) {
        try {
          manualAbiParsed = JSON.parse(manualAbi) as Abi;
        } catch {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "INVALID_INPUT",
                message: "Invalid ABI JSON format",
              },
            },
            { status: 400 }
          );
        }
      }

      if (manualAbiParsed) {
        // Use manual ABI directly
        abiSource = "manual";
        try {
          decoded = decodeCalldata(rawTx.input, manualAbiParsed);
        } catch {
          // Manual ABI didn't work
        }
      } else {
        // Resolve ABI automatically
        const { abiResolution, proxyInfo } = await resolveAbi(
          rawTx.to as Address,
          chainId,
          rawTx.input as Hex
        );

        abiSource = abiResolution.source;
        abiPartial = abiResolution.partial;
        proxyDetected = proxyInfo.isProxy;
        implementationAddress = proxyInfo.implementationAddress;

        if (abiResolution.abi) {
          try {
            decoded = decodeCalldata(rawTx.input, abiResolution.abi);
          } catch {
            // ABI found but decode failed
          }
        }
      }
    }

    const result: ParsedTransaction = {
      txHash: rawTx.hash,
      chainId,
      chainName: chainConfig.name,
      from: rawTx.from,
      to: rawTx.to,
      value: rawTx.value.toString(),
      gasUsed: rawTx.gasUsed.toString(),
      gasPrice: (rawTx.gasPrice ?? 0n).toString(),
      effectiveGasPrice: rawTx.effectiveGasPrice.toString(),
      status: rawTx.status,
      blockNumber: Number(rawTx.blockNumber),
      timestamp: Number(rawTx.timestamp),
      nonce: rawTx.nonce,
      isContractCreation,
      contractAddress: rawTx.contractAddress,
      decoded,
      abiInfo: {
        source: abiSource,
        partial: abiPartial,
        proxyDetected,
        implementationAddress,
      },
      rawInput: rawTx.input,
      explorerUrl: `${chainConfig.explorerUrl}/tx/${rawTx.hash}`,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof InvalidInputError) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: error.message } },
        { status: 400 }
      );
    }
    if (error instanceof TransactionNotFoundError) {
      return NextResponse.json(
        { success: false, error: { code: "TX_NOT_FOUND", message: error.message } },
        { status: 404 }
      );
    }
    if (error instanceof DecodeError) {
      return NextResponse.json(
        { success: false, error: { code: "DECODE_FAILED", message: error.message } },
        { status: 422 }
      );
    }
    if (error instanceof RpcError) {
      return NextResponse.json(
        { success: false, error: { code: "RPC_ERROR", message: error.message } },
        { status: 502 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
