import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GlobalAlertModal } from "@/components/global-alert-modal";

export const metadata: Metadata = {
  title: "CCB - Espaço Infantil Bíblico",
  description: "Sistema de gerenciamento do espaço infantil bíblico da Congregação Cristã no Brasil",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CCB Infantil",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/ccb-logo.png",
    apple: "/ccb-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "CCB Espaço Infantil",
    title: "CCB - Espaço Infantil Bíblico",
    description: "Sistema de gerenciamento do espaço infantil bíblico da Congregação Cristã no Brasil",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <GlobalAlertModal />
      </body>
    </html>
  );
}

