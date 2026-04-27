"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DecodedCalldata, DecodedParam } from "@/lib/types/transaction";
import type { ParsedTransaction } from "@/lib/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyButton } from "./copy-button";
import { ChevronRight, ChevronDown } from "lucide-react";

interface DecodedParamsTableProps {
  decoded: DecodedCalldata;
  abiInfo: ParsedTransaction["abiInfo"];
}

export function DecodedParamsTable({ decoded, abiInfo }: DecodedParamsTableProps) {
  const t = useTranslations("result");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base">{t("parameters")}</CardTitle>
          <Badge variant="secondary" className="text-xs font-normal">
            {t("abiSource")}: {t(`abiSourceLabels.${abiInfo.source}`)}
          </Badge>
        </div>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("functionName")}:</span>
            <code className="font-mono font-semibold text-primary">
              {decoded.functionName}
            </code>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{t("functionSignature")}:</span>
            <code className="font-mono text-muted-foreground">
              {decoded.functionSignature}
            </code>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{t("selector")}:</span>
            <code className="font-mono text-muted-foreground">
              {decoded.selector}
            </code>
            <CopyButton text={decoded.selector} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {decoded.params.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("noParams")}
          </p>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="text-xs">{t("paramName")}</TableHead>
                  <TableHead className="text-xs">{t("paramType")}</TableHead>
                  <TableHead className="text-xs">{t("paramValue")}</TableHead>
                  <TableHead className="text-xs">{t("paramFormatted")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decoded.params.map((param, i) => (
                  <ParamRow key={i} param={param} depth={0} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ParamRow({ param, depth }: { param: DecodedParam; depth: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasComponents = param.components && param.components.length > 0;

  return (
    <>
      <TableRow className={depth > 0 ? "bg-muted/30" : ""}>
        <TableCell className="w-8 py-2">
          {hasComponents && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-0.5 rounded hover:bg-muted"
            >
              {expanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </TableCell>
        <TableCell className="py-2">
          <code
            className="text-xs font-mono"
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            {param.name}
          </code>
        </TableCell>
        <TableCell className="py-2">
          <Badge variant="outline" className="text-[10px] font-mono font-normal">
            {param.type}
          </Badge>
        </TableCell>
        <TableCell className="py-2 max-w-[400px]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              <code className="text-xs font-mono break-all">
                {hasComponents && !expanded
                  ? `{...} (${param.components!.length} fields)`
                  : typeof param.value === "string"
                    ? param.value
                    : JSON.stringify(param.value)}
              </code>
              {typeof param.value === "string" && param.value.length > 10 && (
                <CopyButton text={param.value} />
              )}
            </div>
            {param.rawHex && (
              <div className="flex items-center gap-1">
                <code className="text-[10px] font-mono text-muted-foreground break-all">
                  {param.rawHex}
                </code>
                <CopyButton text={param.rawHex} />
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="py-2">
          {param.formattedValue ? (
            <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {param.formattedValue}
            </code>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </TableCell>
      </TableRow>
      {expanded &&
        hasComponents &&
        param.components!.map((comp, i) => (
          <ParamRow key={i} param={comp} depth={depth + 1} />
        ))}
    </>
  );
}
