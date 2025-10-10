import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
<<<<<<< HEAD

=======
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  esbuild: false,

  server: {
  //host: "0.0.0.0",
  //  http: {
  //     key: fs.readFileSync(path.resolve(__dirname, '../certificates/key.pem')),
  //     cert: fs.readFileSync(path.resolve(__dirname, '../certificates/cert.pem')),
  //   },
    // Optionally, set port or other server options
    port: 5173,
  }
});