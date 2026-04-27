import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo/constants";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { TxResultClient } from "@/components/tx-result-client";

type Props = {
  params: Promise<{ locale: string; hash: string }>;
  searchParams: Promise<{ chain?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, hash } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const shortHash = `${hash.slice(0, 10)}...${hash.slice(-6)}`;
  const title = `TX ${shortHash} | ${t("title")}`;

  const txPath = `/tx/${hash}`;

  return {
    title,
    description: t("description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}${txPath}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${txPath}`])
        ),
        "x-default": `${SITE_URL}/en${txPath}`,
      },
    },
    openGraph: {
      title,
      description: t("description"),
      locale,
      url: `${SITE_URL}/${locale}${txPath}`,
      type: "website",
      siteName: "Smart Contract Transaction Parser",
    },
    twitter: {
      card: "summary",
      title,
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TxResultPage({ params, searchParams }: Props) {
  const { locale, hash } = await params;
  const { chain } = await searchParams;
  setRequestLocale(locale);

  const chainId = chain ? parseInt(chain, 10) : 1;
  const shortHash = `${hash.slice(0, 10)}...${hash.slice(-6)}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/${locale}` },
          { name: `TX ${shortHash}`, url: `${SITE_URL}/${locale}/tx/${hash}` },
        ]}
      />
      <TxResultClient txHash={hash} chainId={chainId} />
    </>
  );
}
