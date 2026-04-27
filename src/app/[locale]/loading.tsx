import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
