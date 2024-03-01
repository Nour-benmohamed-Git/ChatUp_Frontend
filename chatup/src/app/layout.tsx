import type { Metadata } from "next";
import ToasterContext from "../context/toaster-context";
import "./globals.css";
export const metadata: Metadata = {
  title: "ChatUp",
  description: "Created by Nour Elhak Benmohamed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  main: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="relative overflow-hidden">
        {children} <ToasterContext />
      </body>
    </html>
  );
}
