import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore certain warnings
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' && 
          warning.message.includes('use client')
        ) {
          return;
        }
        if (warning.message?.includes('viewBox')) {
          return;
        }
        warn(warning);
      }
    }
  }
});
