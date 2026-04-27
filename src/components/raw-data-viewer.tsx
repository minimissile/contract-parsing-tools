"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "./copy-button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface RawDataViewerProps {
  rawData: string;
}

export function RawDataViewer({ rawData }: RawDataViewerProps) {
  const t = useTranslations("result");
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-left"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <CardTitle className="text-base">{t("rawData")}</CardTitle>
        </button>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="relative">
            <div className="absolute top-2 right-2">
              <CopyButton text={rawData} />
            </div>
            <pre className="rounded-md bg-muted p-4 text-xs font-mono break-all whitespace-pre-wrap max-h-64 overflow-y-auto">
              {rawData}
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
