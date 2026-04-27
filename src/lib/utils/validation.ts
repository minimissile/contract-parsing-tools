const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

export function isValidTxHash(hash: string): boolean {
  return TX_HASH_REGEX.test(hash);
}

export function isValidChainId(chainId: number, supportedIds: number[]): boolean {
  return supportedIds.includes(chainId);
}
