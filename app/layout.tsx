import type { Metadata, Viewport } from "next";
import "./globals.css";
import SoundManager from "@/components/game/SoundManager";

export const metadata: Metadata = {
  title: "Rompecabezas para Niños",
  description: "Juego educativo de trazado y rompecabezas para niños de inicial",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#bae6fd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased overflow-hidden">
        <SoundManager />
        {children}
      </body>
    </html>
  );
}