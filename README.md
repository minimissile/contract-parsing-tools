[中文](./README.zh-CN.md) | English

# Contract Parsing Tools

A smart contract transaction decoder and analyzer for EVM-compatible blockchains. Paste a transaction hash, get human-readable function calls and parameters.

**Live:** [txparser.dev](https://txparser.dev)

## Features

- **Multi-Chain Support** - Ethereum, BSC, Polygon, Arbitrum, Optimism, Base, Avalanche
- **Auto ABI Resolution** - 4-step fallback: Block Explorer -> Proxy Detection -> Sourcify -> 4bytes
- **Proxy Detection** - EIP-1967, OpenZeppelin Legacy, EIP-1167 Minimal Proxy (Clone)
- **Calldata Decoding** - Parses function signatures, parameters, tuples, arrays, and nested types
- **i18n** - English, Simplified Chinese, Traditional Chinese
- **SEO Optimized** - Sitemap, robots.txt, JSON-LD structured data, hreflang

## Supported Chains

| Chain | ID | Explorer |
|-------|----|----------|
| Ethereum | 1 | etherscan.io |
| BNB Smart Chain | 56 | bscscan.com |
| Polygon | 137 | polygonscan.com |
| Arbitrum One | 42161 | arbiscan.io |
| Optimism | 10 | optimistic.etherscan.io |
| Base | 8453 | basescan.org |
| Avalanche C-Chain | 43114 | snowtrace.io |

## Getting Started

### Prerequisites

- Node.js >= 18
- npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/minimissile/contract-parsing-tools.git
cd contract-parsing-tools
npm install
```

### Environment Variables

Copy the example env file and fill in your API keys:

```bash
cp .env.example .env.local
```

```env
# Blockchain RPC Provider (optional, falls back to public RPCs)
ALCHEMY_API_KEY=

# Block Explorer API Keys (for ABI auto-fetch)
ETHERSCAN_API_KEY=
BSCSCAN_API_KEY=
POLYGONSCAN_API_KEY=
ARBISCAN_API_KEY=
OPTIMISM_ETHERSCAN_API_KEY=
BASESCAN_API_KEY=
SNOWTRACE_API_KEY=
```

> All API keys are optional. Without them, ABI resolution falls back to Sourcify and 4bytes.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## API

### `POST /api/parse-transaction`

**Request:**

```json
{
  "txHash": "0x...",
  "chainId": 1,
  "manualAbi": "[...]"  // optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "txHash": "0x...",
    "chainId": 1,
    "chainName": "Ethereum",
    "from": "0x...",
    "to": "0x...",
    "value": "1000000000000000000",
    "status": "success",
    "decoded": {
      "functionName": "transfer",
      "functionSignature": "transfer(address,uint256)",
      "selector": "0xa9059cbb",
      "params": [...]
    },
    "abiInfo": {
      "source": "etherscan",
      "partial": false,
      "proxyDetected": true,
      "implementationAddress": "0x..."
    }
  }
}
```

**Error Codes:**

| Code | Status | Description |
|------|--------|-------------|
| INVALID_INPUT | 400 | Bad request format |
| UNSUPPORTED_CHAIN | 400 | Chain ID not supported |
| INVALID_ABI | 400 | Malformed manual ABI |
| TX_NOT_FOUND | 404 | Transaction not found |
| DECODE_FAILED | 422 | No calldata or decode error |
| RPC_ERROR | 502 | Network/RPC failure |

## ABI Resolution Strategy

Resolution attempts in order, stopping at first success:

1. **Block Explorer API** - Fetches verified ABI from Etherscan-compatible explorers
2. **Proxy Detection** - If the contract is a proxy, resolves implementation address and retries explorer
3. **Sourcify** - Queries the decentralized Sourcify repository (full + partial match)
4. **4bytes** - Looks up function selector in 4byte.directory (partial ABI, no param names)

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Viem](https://viem.sh/) - Type-safe Ethereum interactions
- [Tailwind CSS](https://tailwindcss.com/) 4
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [next-intl](https://next-intl.dev/) - Internationalization
- [Zod](https://zod.dev/) - Schema validation

## Project Structure

```
src/
  app/
    [locale]/         # Locale-prefixed pages
      tx/[hash]/      # Transaction detail page
      chains/[slug]/  # Chain info pages
      functions/[slug]/ # Function detail pages
    api/
      parse-transaction/ # API endpoint
  components/         # React components
  lib/
    abi/              # ABI resolution (etherscan, sourcify, 4bytes, proxy)
    chains/           # Chain config and RPC client factory
    decoder/          # Calldata and transaction decoding
    errors/           # Custom error types
    seo/              # SEO constants and metadata
    types/            # TypeScript type definitions
  i18n/               # Internationalization config
messages/             # Translation files (en, zh, zh-tw)
```

## License

MIT
