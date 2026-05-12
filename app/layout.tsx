import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loop | Group planning for friends",
  description:
    "A private social planning board for discovering events, voting on interest, and turning group chat ideas into confirmed plans."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
