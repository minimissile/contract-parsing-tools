import type { Address, Hex } from "viem";
import { getPublicClient } from "@/lib/chains/client-factory";
import type { ProxyInfo } from "@/lib/types/transaction";

// EIP-1967 implementation storage slot
const EIP1967_IMPL_SLOT =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc" as Hex;

// OpenZeppelin legacy storage slot
const OZ_LEGACY_IMPL_SLOT =
  "0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3" as Hex;

// EIP-1167 minimal proxy bytecode prefix/suffix
const EIP1167_PREFIX = "0x363d3d373d3d3d363d73";
const EIP1167_SUFFIX = "5af43d82803e903d91602b57fd5bf3";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function extractAddressFromSlot(slotValue: Hex): Address | null {
  if (!slotValue || slotValue === "0x" || BigInt(slotValue) === 0n) {
    return null;
  }
  const addr = ("0x" + slotValue.slice(-40)) as Address;
  if (addr.toLowerCase() === ZERO_ADDRESS) return null;
  return addr;
}

function extractEip1167Address(bytecode: Hex): Address | null {
  const hex = bytecode.toLowerCase();
  if (
    hex.startsWith(EIP1167_PREFIX.toLowerCase()) &&
    hex.endsWith(EIP1167_SUFFIX.toLowerCase())
  ) {
    const addrHex = hex.slice(
      EIP1167_PREFIX.length,
      EIP1167_PREFIX.length + 40
    );
    const addr = ("0x" + addrHex) as Address;
    if (addr.toLowerCase() === ZERO_ADDRESS) return null;
    return addr;
  }
  return null;
}

export async function detectProxy(
  contractAddress: Address,
  chainId: number
): Promise<ProxyInfo> {
  const client = getPublicClient(chainId);

  try {
    // Check EIP-1967 implementation slot
    const eip1967Slot = await client.getStorageAt({
      address: contractAddress,
      slot: EIP1967_IMPL_SLOT,
    });

    if (eip1967Slot) {
      const implAddr = extractAddressFromSlot(eip1967Slot);
      if (implAddr) {
        return { isProxy: true, implementationAddress: implAddr };
      }
    }

    // Check OpenZeppelin legacy slot
    const ozSlot = await client.getStorageAt({
      address: contractAddress,
      slot: OZ_LEGACY_IMPL_SLOT,
    });

    if (ozSlot) {
      const implAddr = extractAddressFromSlot(ozSlot);
      if (implAddr) {
        return { isProxy: true, implementationAddress: implAddr };
      }
    }

    // Check EIP-1167 minimal proxy (clone)
    const bytecode = await client.getCode({ address: contractAddress });
    if (bytecode) {
      const implAddr = extractEip1167Address(bytecode);
      if (implAddr) {
        return { isProxy: true, implementationAddress: implAddr };
      }
    }
  } catch {
    // If proxy detection fails, proceed as non-proxy
  }

  return { isProxy: false, implementationAddress: null };
}
