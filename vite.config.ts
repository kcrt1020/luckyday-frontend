import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // 👈 외부 접속 허용
    port: 5173, // 👈 포트 설정 (기본값)
    strictPort: true,
  },
  plugins: [react()],
});
