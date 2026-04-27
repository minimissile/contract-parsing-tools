import type { Hash } from "viem";
import { getPublicClient } from "@/lib/chains/client-factory";
import { TransactionNotFoundError, RpcError } from "@/lib/errors";
import { getChainConfig } from "@/lib/chains/config";
import type { RawTransactionData } from "@/lib/types/transaction";

export async function fetchTransactionData(
  txHash: Hash,
  chainId: number
): Promise<RawTransactionData> {
  const client = getPublicClient(chainId);
  const chainConfig = getChainConfig(chainId);

  try {
    // Parallel fetch: transaction + receipt
    const [tx, receipt] = await Promise.all([
      client.getTransaction({ hash: txHash }),
      client.getTransactionReceipt({ hash: txHash }),
    ]);

    if (!tx) {
      throw new TransactionNotFoundError(
        txHash,
        chainConfig?.name ?? `Chain ${chainId}`
      );
    }

    // Fetch block for timestamp
    const block = await client.getBlock({
      blockNumber: receipt.blockNumber,
    });

    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      input: tx.input,
      value: tx.value,
      nonce: tx.nonce,
      gas: tx.gas,
      gasPrice: tx.gasPrice,
      maxFeePerGas: tx.maxFeePerGas,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      status: receipt.status,
      gasUsed: receipt.gasUsed,
      effectiveGasPrice: receipt.effectiveGasPrice,
      blockNumber: receipt.blockNumber,
      contractAddress: receipt.contractAddress ?? null,
      timestamp: block.timestamp,
    };
  } catch (error) {
    if (
      error instanceof TransactionNotFoundError
    ) {
      throw error;
    }
    throw new RpcError(
      `Failed to fetch transaction data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
