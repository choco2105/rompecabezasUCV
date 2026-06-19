import type { NextConfig } from "next";

// Detecta si estamos en modo desarrollo
const isDev = process.env.NODE_ENV === "development";

// CSP dinámico:
// - En desarrollo: permite 'unsafe-eval' (React lo necesita para hot reload y debugging)
// - En producción: bloquea 'unsafe-eval' (máxima seguridad para usuarios reales)
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://cdn.pixabay.com",
  "media-src 'self' https://cdn.pixabay.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`, // ws/wss para hot reload
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Configuración de imágenes
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
    ],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: cspDirectives,
          },
        ],
      },
    ];
  },

  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;