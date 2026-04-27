import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Contract Transaction Parser",
  description: "Decode and analyze EVM smart contract transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
