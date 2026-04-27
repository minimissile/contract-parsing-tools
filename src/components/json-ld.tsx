import { SITE_URL } from "@/lib/seo/constants";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebApplicationJsonLd({ locale }: { locale: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Smart Contract Transaction Parser",
        url: `${SITE_URL}/${locale}`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description:
          "Decode and analyze EVM smart contract transactions across multiple chains. Parse function calls, parameters, and transaction details instantly.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        inLanguage: locale === "zh-tw" ? "zh-Hant" : locale,
        featureList: [
          "Multi-chain support (Ethereum, BSC, Polygon, Arbitrum, Optimism, Base, Avalanche)",
          "Automatic ABI resolution via Etherscan, Sourcify, and 4bytes",
          "Proxy contract detection (EIP-1967, EIP-1167)",
          "Calldata decoding with parameter names and types",
          "Token amount formatting with 18-decimal precision",
        ],
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      }}
    />
  );
}
