import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentSwarm",
  description: "Coordinated agent workflows with Base MCP approval gates.",
  other: {
    "talentapp:project_verification":
      "5ac31f8c15085579003c5480264c40165661062eaaf9c76a64d0da73d861e7d03f0ca576db1cc97c7f445e0d0cac977060ea6627bc698dbc127d0a4b067105ee",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
