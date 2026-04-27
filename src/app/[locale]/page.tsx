import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { TxInputForm } from "@/components/tx-input-form";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo/constants";
import { WebApplicationJsonLd, FAQJsonLd } from "@/components/json-ld";
import { Code, Globe, Shield } from "lucide-react";

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

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <WebApplicationJsonLd locale={locale} />
      <FAQJsonLd questions={faqQuestions} />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {t("heading")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("subheading")}
        </p>
      </div>

      <TxInputForm />

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
