import type { MetadataRoute } from "next";
import {
  SITE_URL,
  LOCALES,
  CHAIN_SLUGS,
  POPULAR_FUNCTIONS,
} from "@/lib/seo/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}`])
        ),
      },
    });
  }

  // Chain-specific pages
  for (const slug of Object.values(CHAIN_SLUGS)) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/chains/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}/chains/${slug}`])
          ),
        },
      });
    }
  }

  // Popular function pages
  for (const fn of POPULAR_FUNCTIONS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/functions/${fn.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}/functions/${fn.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
