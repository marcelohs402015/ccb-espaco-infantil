import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CCB - Espaço Infantil",
  description: "Sistema de gerenciamento do espaço infantil da Congregação Cristã no Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

