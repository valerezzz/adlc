import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  server: {
    https: true,
    host: true,
  },
  plugins: [command === "serve" ? mkcert() : null].filter(Boolean),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        hotel: resolve(__dirname, "hotel.html"),
        "hotel-hub": resolve(__dirname, "hotel-hub.html"),
        menudujour: resolve(__dirname, "menudujour.html"),
      },
    },
  },
}));
