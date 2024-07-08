import ToasterContext from "@/context/ToasterContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="relative overflow-hidden">
        {children}
        <ToasterContext />
      </body>
    </html>
  );
}
