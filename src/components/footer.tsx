export function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground max-w-5xl">
        <p>Smart Contract Transaction Parser</p>
        <p className="mt-1 text-xs">
          Powered by viem &middot; Data from Etherscan &amp; Sourcify
        </p>
      </div>
    </footer>
  );
}
