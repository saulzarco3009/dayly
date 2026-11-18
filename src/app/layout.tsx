import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAYLY. — Personal Productivity System",
  description: "Plan your month. Organize your week. Focus on today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FCFAFB] text-[#29252B]">
        {children}
      </body>
    </html>
  );
}
