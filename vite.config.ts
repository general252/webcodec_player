import path from "path";
import { defineConfig, UserConfig } from "vite";
import dts from "vite-plugin-dts";

const entry = path.resolve(__dirname, "src/index.ts");
//console.log("entry", entry);
export default defineConfig(({ command, mode }) => {
  const config: UserConfig =
    command == "build"
      ? {
          build: {
            lib: {
              entry,
              name: "hellox",
              fileName: (format) => `index.js`, // 输出文件名
              formats: ["umd"],
            },
          },
          plugins: [dts()],
        }
      : {
          optimizeDeps: {},
        };
  return config;
});
