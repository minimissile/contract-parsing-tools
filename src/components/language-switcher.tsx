"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const localeLabels: Record<string, string> = {
  en: "English",
  zh: "简体中文",
  "zh-tw": "繁體中文",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <Select value={locale} onValueChange={(v) => { if (v !== null) handleChange(v); }}>
      <SelectTrigger className="w-auto gap-1.5 h-8 text-xs border-none shadow-none">
        <Globe className="h-3.5 w-3.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {Object.entries(localeLabels).map(([key, label]) => (
          <SelectItem key={key} value={key} className="text-xs">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
