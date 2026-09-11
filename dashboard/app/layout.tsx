import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinOps Control Center",
  description: "Cloud Cost Optimization & Ephemeral Environments",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
