import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "../redux/store-provider";
import { Toaster } from "sonner";
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
        <Toaster position="bottom-left" expand={true} richColors />
      </body>
    </html>
  );
}
