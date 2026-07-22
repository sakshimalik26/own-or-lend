import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.GITHUB_PAGES === "true" ? "/own-or-lend" : "";

export const metadata: Metadata = {
  title: "Own or Lend? | Shares & Bonds Visual Lab",
  description: "An interactive, beginner-friendly classroom simulator for understanding shares, bonds, ownership, voting power, assets, liabilities, and risk.",
  icons: { icon: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
