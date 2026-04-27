"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
        <p className="text-destructive font-medium mb-4">{t("genericError")}</p>
        <Button onClick={reset} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    </div>
  );
}
