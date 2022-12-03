import { defineConfig } from "vite";

export default defineConfig({
  base: "/forklift-simulator-2022/",
  //base: "",
  build: {
    minify: false,
    rollupOptions: {
      external: [/three.*/, "dat.gui"],
    },
  },
});
