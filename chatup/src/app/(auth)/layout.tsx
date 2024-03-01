import type { Metadata } from "next";
import "../globals.css";
export const metadata: Metadata = {
  title: "ChatUp | Authentication",
  description: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="flex flex-col justify-center w-full h-screen md:h-auto max-w-md bg-gradient-to-r from-black via-gray-900 to-gray-700 p-6 gap-4 rounded-none md:rounded-md shadow-md">
        {children}
      </div>
    </div>
  );
}
