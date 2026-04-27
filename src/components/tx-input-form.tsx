"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChainSelector } from "./chain-selector";
import { Search } from "lucide-react";
import { toast } from "sonner";

const CHAIN_STORAGE_KEY = "contract-parser-chain-id";

export function TxInputForm({ defaultChainId }: { defaultChainId?: string }) {
  const t = useTranslations("home");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const [txHash, setTxHash] = useState("");
  const [chainId, setChainId] = useState(defaultChainId ?? "1");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (defaultChainId) return;
    const saved = localStorage.getItem(CHAIN_STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initializing from localStorage on mount
    if (saved) setChainId(saved);
  }, [defaultChainId]);

  function handleChainChange(value: string) {
    setChainId(value);
    localStorage.setItem(CHAIN_STORAGE_KEY, value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const hash = txHash.trim();

    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
      toast.error(tErrors("invalidHash"));
      return;
    }

    setIsPending(true);
    router.push(`/tx/${hash}?chain=${chainId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="chain">{t("chainLabel")}</Label>
        <ChainSelector value={chainId} onValueChange={handleChainChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="txHash">Transaction Hash</Label>
        <div className="flex gap-2">
          <Input
            id="txHash"
            type="text"
            placeholder={t("inputPlaceholder")}
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="font-mono text-sm"
            autoComplete="off"
            spellCheck={false}
          />
          <Button type="submit" disabled={isPending} className="shrink-0">
            {isPending ? (
              t("parsing")
            ) : (
              <>
                <Search className="h-4 w-4 mr-1.5" />
                {t("parseButton")}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
