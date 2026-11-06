import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: { outDir: "dist", assetsInlineLimit: 0 },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "inline",
      includeAssets: ["icon.svg", "icon-192.png", "icon-512.png", "pilot.js"],
      manifest: {
        name: "Neev",
        short_name: "Neev",
        description: "See who holds you, and reach them. Everything stays on your phone.",
        lang: "en",
        start_url: "/",
        display: "standalone",
        background_color: "#16130f",
        theme_color: "#16130f",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{html,js,css,svg,png}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          { urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//, handler: "CacheFirst",
            options: { cacheName: "fonts", expiration: { maxEntries: 30, maxAgeSeconds: 31536000 } } },
        ],
      },
    }),
  ],
});
