import { CHAIN_CONFIGS } from "@/lib/chains/config";

/**
 * Base URL for the site. Uses NEXT_PUBLIC_SITE_URL env var in production,
 * falls back to localhost in development.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://txparser.dev";

export const LOCALES = ["en", "zh", "zh-tw"] as const;
export const DEFAULT_LOCALE = "en";

/**
 * Chain slug mapping for SEO-friendly URLs.
 * e.g., /chains/ethereum instead of /chains/1
 */
export const CHAIN_SLUGS: Record<number, string> = {
  1: "ethereum",
  56: "bsc",
  137: "polygon",
  42161: "arbitrum",
  10: "optimism",
  8453: "base",
  43114: "avalanche",
};

export const SLUG_TO_CHAIN_ID: Record<string, number> = Object.fromEntries(
  Object.entries(CHAIN_SLUGS).map(([id, slug]) => [slug, Number(id)])
);

/**
 * Popular function signatures for programmatic SEO pages.
 */
export const POPULAR_FUNCTIONS = [
  {
    slug: "transfer",
    selector: "0xa9059cbb",
    signature: "transfer(address,uint256)",
    category: "ERC20",
  },
  {
    slug: "approve",
    selector: "0x095ea7b3",
    signature: "approve(address,uint256)",
    category: "ERC20",
  },
  {
    slug: "transferFrom",
    selector: "0x23b872dd",
    signature: "transferFrom(address,address,uint256)",
    category: "ERC20",
  },
  {
    slug: "swap",
    selector: "0x38ed1739",
    signature: "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
    category: "DEX",
  },
  {
    slug: "multicall",
    selector: "0xac9650d8",
    signature: "multicall(bytes[])",
    category: "Utility",
  },
  {
    slug: "deposit",
    selector: "0xd0e30db0",
    signature: "deposit()",
    category: "DeFi",
  },
  {
    slug: "withdraw",
    selector: "0x2e1a7d4d",
    signature: "withdraw(uint256)",
    category: "DeFi",
  },
  {
    slug: "stake",
    selector: "0xa694fc3a",
    signature: "stake(uint256)",
    category: "Staking",
  },
  {
    slug: "claim",
    selector: "0x4e71d92d",
    signature: "claim()",
    category: "Rewards",
  },
  {
    slug: "safeTransferFrom",
    selector: "0x42842e0e",
    signature: "safeTransferFrom(address,address,uint256)",
    category: "ERC721",
  },
] as const;

/**
 * Get chain config by slug.
 */
export function getChainBySlug(slug: string) {
  const chainId = SLUG_TO_CHAIN_ID[slug];
  if (chainId === undefined) return undefined;
  return CHAIN_CONFIGS[chainId];
}
