import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Contract Transaction Parser",
  description: "Decode and analyze EVM smart contract transactions",
  verification: {
    google: "zoeBUdmEcXqVF1a0SR1DuB6gH78gPNlFOs746vX4zJE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
