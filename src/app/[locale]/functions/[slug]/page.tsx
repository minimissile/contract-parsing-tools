import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import {
  SITE_URL,
  POPULAR_FUNCTIONS,
  CHAIN_SLUGS,
} from "@/lib/seo/constants";
import { CHAIN_CONFIGS } from "@/lib/chains/config";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { TxInputForm } from "@/components/tx-input-form";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Hash } from "lucide-react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function getFunctionBySlug(slug: string) {
  return POPULAR_FUNCTIONS.find((fn) => fn.slug === slug);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    POPULAR_FUNCTIONS.map((fn) => ({ locale, slug: fn.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const fn = getFunctionBySlug(slug);
  if (!fn) return {};

  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("functionPage.title", { name: fn.slug, signature: fn.signature });
  const description = t("functionPage.description", { name: fn.slug, signature: fn.signature, category: fn.category });
  const pagePath = `/functions/${slug}`;

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
  };
}

export default async function FunctionPage({ params }: Props) {
  const { locale, slug } = await params;
  const fn = getFunctionBySlug(slug);
  if (!fn) notFound();

  setRequestLocale(locale);

  return <FunctionPageContent slug={slug} locale={locale} />;
}

function FunctionPageContent({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  const t = useTranslations("seo");
  const fn = getFunctionBySlug(slug)!;

  const supportedChains = Object.entries(CHAIN_CONFIGS).map(([id, config]) => ({
    id: Number(id),
    name: config.name,
    slug: CHAIN_SLUGS[Number(id)],
  }));

  // Parse function params from signature
  const paramsMatch = fn.signature.match(/\((.+)\)/);
  const paramTypes = paramsMatch ? paramsMatch[1].split(",") : [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/${locale}` },
          { name: fn.slug, url: `${SITE_URL}/${locale}/functions/${slug}` },
        ]}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          {fn.category}
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {t("functionPage.heading", { name: fn.slug })}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("functionPage.subheading", { name: fn.slug, category: fn.category })}
        </p>
      </div>

      <TxInputForm />

      <div className="mt-16 space-y-8">
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("functionPage.signatureTitle")}
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-24 shrink-0">{t("functionPage.name")}</span>
              <code className="font-mono font-medium">{fn.slug}</code>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-24 shrink-0">{t("functionPage.selector")}</span>
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded">{fn.selector}</code>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground w-24 shrink-0">{t("functionPage.fullSig")}</span>
              <code className="font-mono text-xs break-all">{fn.signature}</code>
            </div>
            {paramTypes.length > 0 && (
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground w-24 shrink-0">{t("functionPage.params")}</span>
                <div className="flex flex-wrap gap-1.5">
                  {paramTypes.map((p, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-mono"
                    >
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      {p.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("functionPage.aboutTitle", { name: fn.slug })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("functionPage.aboutText", { name: fn.slug, category: fn.category, signature: fn.signature })}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("functionPage.chainsTitle", { name: fn.slug })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {supportedChains.map((chain) => (
              <Link
                key={chain.id}
                href={`/chains/${chain.slug}`}
                className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent transition-colors"
              >
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
                {chain.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
