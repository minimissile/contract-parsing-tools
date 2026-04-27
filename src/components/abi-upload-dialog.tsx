"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface AbiUploadDialogProps {
  onSubmit: (abi: string) => void;
}

export function AbiUploadDialog({ onSubmit }: AbiUploadDialogProps) {
  const t = useTranslations("abiUpload");
  const [open, setOpen] = useState(false);
  const [abiText, setAbiText] = useState("");

  function handleSubmit() {
    const trimmed = abiText.trim();
    if (!trimmed) return;

    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) {
        toast.error("ABI must be a JSON array");
        return;
      }
      setOpen(false);
      onSubmit(trimmed);
    } catch {
      toast.error("Invalid JSON format");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Upload className="h-4 w-4 mr-1.5" />
        {t("submit")}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder={t("placeholder")}
            value={abiText}
            onChange={(e) => setAbiText(e.target.value)}
            className="font-mono text-xs min-h-[200px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={!abiText.trim()}>
              {t("submit")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
