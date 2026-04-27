"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { ParsedTransaction } from "@/lib/types/transaction";
import type { ApiResponse } from "@/lib/types/api";
import { TxResultCard } from "./tx-result-card";
import { DecodedParamsTable } from "./decoded-params-table";
import { RawDataViewer } from "./raw-data-viewer";
import { AbiUploadDialog } from "./abi-upload-dialog";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

interface TxResultClientProps {
  txHash: string;
  chainId: number;
}

async function parseTx(
  txHash: string,
  chainId: number,
  manualAbi?: string
): Promise<{ data: ParsedTransaction | null; error: string | null }> {
  const body: Record<string, unknown> = { txHash, chainId };
  if (manualAbi) body.manualAbi = manualAbi;

  const res = await fetch("/api/parse-transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json: ApiResponse = await res.json();

  if (json.success) {
    return { data: json.data, error: null };
  }
  return { data: null, error: json.error.message };
}

export function TxResultClient({ txHash, chainId }: TxResultClientProps) {
  const t = useTranslations("result");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const [data, setData] = useState<ParsedTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTransaction = useCallback(
    async (manualAbi?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await parseTx(txHash, chainId, manualAbi);
        setData(result.data);
        setError(result.error);
      } catch {
        setError(tErrors("networkError"));
      } finally {
        setLoading(false);
      }
    },
    [txHash, chainId, tErrors]
  );

  useEffect(() => {
    // Data fetching on mount/param change - setState in async callback is intentional
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTransaction();
  }, [loadTransaction]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm">{tCommon("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium mb-4">{error}</p>
          <Button render={<Link href="/" />} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              {t("parseAnother")}
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <Button render={<Link href="/" />} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            {t("parseAnother")}
        </Button>
      </div>

      <TxResultCard data={data} />

      {data.decoded ? (
        <DecodedParamsTable decoded={data.decoded} abiInfo={data.abiInfo} />
      ) : data.rawInput && data.rawInput !== "0x" && !data.isContractCreation ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              {tErrors("abiNotFound")}
            </p>
          </div>
          <AbiUploadDialog onSubmit={(abi) => loadTransaction(abi)} />
        </div>
      ) : null}

      {data.rawInput && data.rawInput !== "0x" && (
        <RawDataViewer rawData={data.rawInput} />
      )}
    </div>
  );
}
