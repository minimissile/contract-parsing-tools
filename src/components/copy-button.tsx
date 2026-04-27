"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({ text }: { text: string }) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(t("copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 p-0.5 rounded hover:bg-muted transition-colors"
      title={t("copy")}
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  );
}
