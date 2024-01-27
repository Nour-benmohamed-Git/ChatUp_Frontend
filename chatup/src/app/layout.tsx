import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "../redux/store-provider";

export const metadata: Metadata = {
  title: "ChatUp",
  description: "Created by Nour Elhak Benmohamed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="relative overflow-hidden">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
