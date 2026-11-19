import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAYLY. — Sistema de Productividad Personal",
  description: "Planifica tu mes. Organiza tu semana. Enfócate en hoy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FCFAFB] text-[#29252B]">
        {children}
      </body>
    </html>
  );
}
