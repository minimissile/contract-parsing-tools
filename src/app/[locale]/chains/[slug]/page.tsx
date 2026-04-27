import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import {
  SITE_URL,
  CHAIN_SLUGS,
  getChainBySlug,
} from "@/lib/seo/constants";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { TxInputForm } from "@/components/tx-input-form";
import { ArrowRight } from "lucide-react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const slugs = Object.values(CHAIN_SLUGS);
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const chain = getChainBySlug(slug);
  if (!chain) return {};

  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("chainPage.title", { chain: chain.name });
  const description = t("chainPage.description", { chain: chain.name });
  const pagePath = `/chains/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}${pagePath}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${pagePath}`])
        ),
        "x-default": `${SITE_URL}/en${pagePath}`,
      },
    },
    openGraph: {
      title,
      description,
      locale,
      url: `${SITE_URL}/${locale}${pagePath}`,
      type: "website",
      siteName: "Smart Contract Transaction Parser",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ChainPage({ params }: Props) {
  const { locale, slug } = await params;
  const chain = getChainBySlug(slug);
  if (!chain) notFound();

  setRequestLocale(locale);

  return <ChainPageContent slug={slug} chainId={chain.id} locale={locale} />;
}

function ChainPageContent({
  slug,
  chainId,
  locale,
}: {
  slug: string;
  chainId: number;
  locale: string;
}) {
  const t = useTranslations("seo");
  const chain = getChainBySlug(slug)!;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/${locale}` },
          { name: chain.name, url: `${SITE_URL}/${locale}/chains/${slug}` },
        ]}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          {chain.shortName}
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {t("chainPage.heading", { chain: chain.name })}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("chainPage.subheading", { chain: chain.name })}
        </p>
      </div>

      <TxInputForm defaultChainId={String(chainId)} />

      <div className="mt-16 space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("chainPage.aboutTitle", { chain: chain.name })}
          </h2>
          <div className="prose prose-sm text-muted-foreground max-w-none">
            <p>{t("chainPage.aboutText", { chain: chain.name, symbol: chain.nativeCurrency.symbol })}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("chainPage.featuresTitle")}
          </h2>
          <ul className="space-y-3">
            {(["f1", "f2", "f3", "f4"] as const).map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{t(`chainPage.features.${key}`, { chain: chain.name })}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-2">
            {t("chainPage.detailsTitle")}
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">{t("chainPage.chainId")}</dt>
              <dd className="font-mono font-medium">{chain.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("chainPage.nativeCurrency")}</dt>
              <dd className="font-medium">{chain.nativeCurrency.symbol}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("chainPage.explorer")}</dt>
              <dd>
                <a
                  href={chain.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {chain.explorerUrl.replace("https://", "")}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
