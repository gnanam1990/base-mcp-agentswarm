import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentSwarm",
  description: "Coordinated agent workflows with Base MCP approval gates.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
