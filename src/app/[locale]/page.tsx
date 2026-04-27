import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { TxInputForm } from "@/components/tx-input-form";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo/constants";
import { getSupportedChains } from "@/lib/chains/config";
import {
  WebApplicationJsonLd,
  FAQJsonLd,
  HowToJsonLd,
} from "@/components/json-ld";
import { Code, Globe, Shield, ChevronDown } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}`])
        ),
        "x-default": `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale,
      url: `${SITE_URL}/${locale}`,
      type: "website",
      siteName: "Smart Contract Transaction Parser",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations("home");
  const tSeo = useTranslations("seo");

  const faqQuestions = [
    { question: tSeo("faq.q1"), answer: tSeo("faq.a1") },
    { question: tSeo("faq.q2"), answer: tSeo("faq.a2") },
    { question: tSeo("faq.q3"), answer: tSeo("faq.a3") },
  ];

  const howToSteps = [
    { name: t("steps.s1title"), text: t("steps.s1desc") },
    { name: t("steps.s2title"), text: t("steps.s2desc") },
    { name: t("steps.s3title"), text: t("steps.s3desc") },
  ];

  const chains = getSupportedChains();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <WebApplicationJsonLd locale={locale} />
      <FAQJsonLd questions={faqQuestions} />
      <HowToJsonLd
        name="How to Decode a Smart Contract Transaction"
        steps={howToSteps}
      />

      {/* Hero + Definition Block (AI-extractable) */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {t("heading")}
        </h1>
        <p className="text-muted-foreground text-lg mb-4">
          {t("subheading")}
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          {t("definition")}
        </p>
      </div>

      {/* Transaction Input Form */}
      <TxInputForm />

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <FeatureCard
          icon={<Code className="h-5 w-5" />}
          title={t("features.decode")}
          description={t("features.decodeDesc")}
        />
        <FeatureCard
          icon={<Globe className="h-5 w-5" />}
          title={t("features.multichain")}
          description={t("features.multichainDesc")}
        />
        <FeatureCard
          icon={<Shield className="h-5 w-5" />}
          title={t("features.proxy")}
          description={t("features.proxyDesc")}
        />
      </div>

      {/* How It Works — Step-by-step (AI-extractable process) */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {t("howItWorks")}
        </h2>
        <div className="space-y-4">
          {(["s1", "s2", "s3"] as const).map((key, i) => (
            <div
              key={key}
              className="flex gap-4 items-start rounded-lg border p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {i + 1}
              </div>
              <div>
                <h3 className="font-medium text-sm">
                  {t(`steps.${key}title`)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t(`steps.${key}desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Chains Comparison Table (AI-extractable table) */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {t("chainComparisonTitle")}
        </h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Chain</th>
                <th className="px-4 py-3 text-left font-medium">Chain ID</th>
                <th className="px-4 py-3 text-left font-medium">Currency</th>
                <th className="px-4 py-3 text-left font-medium">Explorer</th>
              </tr>
            </thead>
            <tbody>
              {chains.map((chain) => (
                <tr key={chain.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{chain.name}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {chain.id}
                  </td>
                  <td className="px-4 py-3">{chain.nativeCurrency.symbol}</td>
                  <td className="px-4 py-3">
                    <a
                      href={chain.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {chain.explorerUrl.replace("https://", "")}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Section (Authority signals — specific numbers) */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {t("statsTitle")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["chains", "functions", "abiSources", "languages"] as const).map(
            (key) => (
              <div
                key={key}
                className="rounded-lg border bg-card p-4 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  {t(`stats.${key}`)}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Visible FAQ Section (AI-extractable Q&A) */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {t("faqTitle")}
        </h2>
        <div className="space-y-4">
          {faqQuestions.map((faq, i) => (
            <details key={i} className="group rounded-lg border">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-sm">
                {faq.question}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 text-sm text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Freshness Signal */}
      <p className="text-xs text-muted-foreground text-center mt-12">
        {t("lastUpdated")}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-5 text-card-foreground">
      <div className="flex items-center gap-2 mb-2 text-primary">
        {icon}
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
