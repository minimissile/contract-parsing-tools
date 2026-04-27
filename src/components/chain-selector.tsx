"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { getSupportedChains } from "@/lib/chains/config";

const chains = getSupportedChains();
const chainMap = new Map(chains.map((c) => [String(c.id), c]));

interface ChainSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ChainSelector({ value, onValueChange }: ChainSelectorProps) {
  const t = useTranslations("home");
  const selected = chainMap.get(value);

  return (
    <Select value={value} onValueChange={(v) => { if (v !== null) onValueChange(v); }}>
      <SelectTrigger className="w-full">
        {selected ? (
          <span className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {selected.shortName}
            </span>
            <span>{selected.name}</span>
          </span>
        ) : (
          <SelectValue placeholder={t("chainPlaceholder")} />
        )}
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem key={chain.id} value={String(chain.id)}>
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {chain.shortName}
              </span>
              <span>{chain.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
