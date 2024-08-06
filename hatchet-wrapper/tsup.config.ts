import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/**/*.ts", "src/**/*.tsx"],
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: true,
  outDir: "dist",
  ...options,
}));
