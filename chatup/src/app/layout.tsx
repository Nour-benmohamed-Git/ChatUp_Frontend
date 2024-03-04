import ToasterContext from "@/context/toaster-context";
import "./globals.css";

export default function AuthLayout({
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
