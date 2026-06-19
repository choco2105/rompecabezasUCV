import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import SoundManager from "@/components/game/SoundManager";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mi Perú - Rompecabezas Intercultural",
  description: "Juego educativo de rompecabezas con flora, fauna y paisajes del Perú",
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
    <html lang="es" className={nunito.variable}>
      <body className="antialiased overflow-hidden font-nunito">
        <SoundManager />
        {children}
      </body>
    </html>
  );
}