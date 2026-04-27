export function formatBigInt(value: bigint): string {
  return value.toString();
}

export function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatGwei(weiValue: bigint): string {
  const gwei = Number(weiValue) / 1e9;
  return `${gwei.toFixed(2)} Gwei`;
}

export function formatEther(weiValue: bigint): string {
  const ether = Number(weiValue) / 1e18;
  if (ether === 0) return "0";
  if (ether < 0.0001) return "< 0.0001";
  return ether.toFixed(6).replace(/\.?0+$/, "");
}

export function serializeBigInts(obj: unknown): unknown {
  if (typeof obj === "bigint") {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInts);
  }
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInts(value);
    }
    return result;
  }
  return obj;
}
