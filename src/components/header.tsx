"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { FileCode2 } from "lucide-react";

export function Header() {
  const t = useTranslations("meta");

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-5xl">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm">
          <FileCode2 className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">{t("title")}</span>
          <span className="sm:hidden">TX Parser</span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
