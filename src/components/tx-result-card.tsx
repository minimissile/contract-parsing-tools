"use client";

import { useTranslations } from "next-intl";
import type { ParsedTransaction } from "@/lib/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "./copy-button";
import { ExternalLink } from "lucide-react";
import { formatEther, formatGwei } from "@/lib/utils/format";

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

interface TxResultCardProps {
  data: ParsedTransaction;
}

export function TxResultCard({ data }: TxResultCardProps) {
  const t = useTranslations("result");

  const timestamp = new Date(data.timestamp * 1000);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t("txInfo")}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={data.status === "success" ? "default" : "destructive"}>
              {data.status === "success" ? t("success") : t("reverted")}
            </Badge>
            <a
              href={data.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {t("viewOnExplorer")}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <InfoRow label="Chain" value={`${data.chainName} (${data.chainId})`} />
        <Separator />
        <InfoRow label={t("from")} value={data.from} mono copyable />
        <InfoRow
          label={t("to")}
          value={data.isContractCreation ? `[${t("contractCreation")}]` : (data.to ?? "-")}
          mono
          copyable={!data.isContractCreation && !!data.to}
        />
        {data.isContractCreation && data.contractAddress && (
          <InfoRow label={t("deployedAddress")} value={data.contractAddress} mono copyable />
        )}
        <Separator />
        <InfoRow label={t("value")} value={`${formatEther(BigInt(data.value))} ${data.chainName === "BNB Smart Chain" ? "BNB" : data.chainName === "Avalanche C-Chain" ? "AVAX" : data.chainName === "Polygon" ? "POL" : "ETH"}`} />
        <InfoRow label={t("gasUsed")} value={BigInt(data.gasUsed).toLocaleString()} />
        <InfoRow label={t("effectiveGasPrice")} value={formatGwei(BigInt(data.effectiveGasPrice))} />
        <Separator />
        <InfoRow label={t("blockNumber")} value={data.blockNumber.toLocaleString()} />
        <InfoRow
          label={t("timestamp")}
          value={`${timestamp.toLocaleString()} (${formatTimeAgo(timestamp)})`}
        />
        <InfoRow label={t("nonce")} value={String(data.nonce)} />

        {data.abiInfo.proxyDetected && data.abiInfo.implementationAddress && (
          <>
            <Separator />
            <div className="rounded-md bg-blue-500/5 border border-blue-500/20 p-3">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {t("proxyDetected")}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">{t("implementationAddress")}:</span>
                <code className="text-xs font-mono">{data.abiInfo.implementationAddress}</code>
                <CopyButton text={data.abiInfo.implementationAddress} />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
  copyable = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground shrink-0 text-xs">{label}</span>
      <div className="flex items-center gap-1 min-w-0">
        <span
          className={`text-right break-all ${mono ? "font-mono text-xs" : "text-sm"}`}
        >
          {value}
        </span>
        {copyable && <CopyButton text={value} />}
      </div>
    </div>
  );
}
