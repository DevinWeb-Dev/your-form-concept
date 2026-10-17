import process from "node:process";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

const isGitHubPagesBuild =
  process.env.GITHUB_PAGES === "true";

const repositoryName =
  process.env.GITHUB_REPOSITORY
    ?.split("/")
    .pop() || "your-form-concept";

const isHomepageRepository =
  repositoryName
    .toLowerCase()
    .endsWith(".github.io");

const base = isGitHubPagesBuild
  ? isHomepageRepository
    ? "/"
    : `/${repositoryName}/`
  : "/";

export default defineConfig({
  plugins: [react()],

  base,

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    emptyOutDir: true,
  },
});