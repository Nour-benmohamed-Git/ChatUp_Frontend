import ToasterContext from "@/context/ToasterContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="scroll-smooth">
        {children}
        <ToasterContext />
      </body>
    </html>
  );
}
