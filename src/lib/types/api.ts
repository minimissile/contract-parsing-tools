import type { ParsedTransaction } from "./transaction";

export interface ParseTransactionRequest {
  txHash: string;
  chainId: number;
  manualAbi?: string;
}

export interface ApiSuccessResponse {
  success: true;
  data: ParsedTransaction;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    rawInput?: string;
  };
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
