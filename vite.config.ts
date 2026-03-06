import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Avoid duplicated React instances across split chunks/libraries.
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React 코어
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor';
          }
          // 상태 관리 & 데이터 fetching
          if (id.includes('node_modules/zustand/') || 
              id.includes('node_modules/@tanstack/')) {
            return 'state-vendor';
          }
          // NOTE:
          // react-apexcharts is distributed as a UMD/CJS build and can fail in
          // production when forcibly isolated into a manual chunk
          // (e.g. "Cannot read properties of undefined (reading 'Component')").
          // Let Vite/Rollup place it automatically.
          // Material UI (Dashboard용)
          if (id.includes('node_modules/@mui/') || 
              id.includes('node_modules/@emotion/')) {
            return 'mui-vendor';
          }
          // Ant Design
          if (id.includes('node_modules/antd/') || 
              id.includes('node_modules/@ant-design/')) {
            return 'antd-vendor';
          }
        },
      },
    },
  },
  // 환경 변수 접두사 설정
  envPrefix: "VITE_",
});

