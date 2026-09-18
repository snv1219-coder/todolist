import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "export",
  basePath: isGithubPages ? "/todolist" : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
