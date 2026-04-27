中文 | [English](./README.md)

# Contract Parsing Tools

面向 EVM 兼容区块链的智能合约交易解码与分析工具。输入交易哈希，即可获取可读的函数调用和参数信息。

**在线体验：** [txparser.dev](https://txparser.dev)

## 功能特性

- **多链支持** - Ethereum、BSC、Polygon、Arbitrum、Optimism、Base、Avalanche
- **ABI 自动解析** - 4 步回退策略：区块浏览器 -> 代理检测 -> Sourcify -> 4bytes
- **代理合约检测** - 支持 EIP-1967、OpenZeppelin Legacy、EIP-1167 Minimal Proxy (Clone)
- **Calldata 解码** - 解析函数签名、参数、元组、数组及嵌套类型
- **国际化** - 英文、简体中文、繁体中文
- **SEO 优化** - Sitemap、robots.txt、JSON-LD 结构化数据、hreflang

## 支持的链

| 链 | ID | 区块浏览器 |
|----|----|-----------|
| Ethereum | 1 | etherscan.io |
| BNB Smart Chain | 56 | bscscan.com |
| Polygon | 137 | polygonscan.com |
| Arbitrum One | 42161 | arbiscan.io |
| Optimism | 10 | optimistic.etherscan.io |
| Base | 8453 | basescan.org |
| Avalanche C-Chain | 43114 | snowtrace.io |

## 快速开始

### 前置要求

- Node.js >= 18
- npm / yarn / pnpm

### 安装

```bash
git clone https://github.com/minimissile/contract-parsing-tools.git
cd contract-parsing-tools
npm install
```

### 环境变量

复制示例配置文件并填入你的 API Key：

```bash
cp .env.example .env.local
```

```env
# 区块链 RPC 提供商（可选，未配置时使用公共 RPC）
ALCHEMY_API_KEY=

# 区块浏览器 API Key（用于自动获取 ABI）
ETHERSCAN_API_KEY=
BSCSCAN_API_KEY=
POLYGONSCAN_API_KEY=
ARBISCAN_API_KEY=
OPTIMISM_ETHERSCAN_API_KEY=
BASESCAN_API_KEY=
SNOWTRACE_API_KEY=
```

> 所有 API Key 均为可选。未配置时，ABI 解析会回退到 Sourcify 和 4bytes。

### 开发

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看。

### 构建

```bash
npm run build
npm start
```

## API

### `POST /api/parse-transaction`

**请求：**

```json
{
  "txHash": "0x...",
  "chainId": 1,
  "manualAbi": "[...]"  // 可选
}
```

**响应：**

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

**错误码：**

| 错误码 | HTTP 状态码 | 说明 |
|--------|-----------|------|
| INVALID_INPUT | 400 | 请求格式错误 |
| UNSUPPORTED_CHAIN | 400 | 不支持的链 |
| INVALID_ABI | 400 | 手动提供的 ABI 格式错误 |
| TX_NOT_FOUND | 404 | 交易不存在 |
| DECODE_FAILED | 422 | 无 calldata 或解码失败 |
| RPC_ERROR | 502 | 网络/RPC 故障 |

## ABI 解析策略

按顺序尝试，首次成功即停止：

1. **区块浏览器 API** - 从 Etherscan 兼容的浏览器获取已验证的 ABI
2. **代理检测** - 若合约为代理合约，解析实现地址后重新尝试浏览器 API
3. **Sourcify** - 查询去中心化 Sourcify 仓库（完全匹配 + 部分匹配）
4. **4bytes** - 在 4byte.directory 中查找函数选择器（部分 ABI，无参数名）

## 技术栈

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Viem](https://viem.sh/) - 类型安全的以太坊交互库
- [Tailwind CSS](https://tailwindcss.com/) 4
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [next-intl](https://next-intl.dev/) - 国际化
- [Zod](https://zod.dev/) - Schema 校验

## 项目结构

```
src/
  app/
    [locale]/         # 带语言前缀的页面
      tx/[hash]/      # 交易详情页
      chains/[slug]/  # 链信息页
      functions/[slug]/ # 函数详情页
    api/
      parse-transaction/ # API 端点
  components/         # React 组件
  lib/
    abi/              # ABI 解析（etherscan、sourcify、4bytes、代理检测）
    chains/           # 链配置与 RPC 客户端工厂
    decoder/          # Calldata 与交易解码
    errors/           # 自定义错误类型
    seo/              # SEO 常量与元数据
    types/            # TypeScript 类型定义
  i18n/               # 国际化配置
messages/             # 翻译文件（en、zh、zh-tw）
```

## 许可证

MIT
