import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const backendUrl = (
  process.env.NEXT_PUBLIC_API_URL || "https://rac-lia-backend-n485.vercel.app"
).replace(/\/+$/, "");

const emptyPolyfill = path.join(projectRoot, "js/emptyPolyfill.js");

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    inlineCss: true,
  },
  outputFileTracingRoot: projectRoot,
  turbopack: {
    rules: {
      "*": {
        condition: {
          all: ["foreign", { path: /polyfills\/polyfill-module\.js$/ }],
        },
        loaders: ["./scripts/empty-module-loader.cjs"],
        as: "*.js",
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "next/dist/build/polyfills/polyfill-module": emptyPolyfill,
        "next/dist/build/polyfills/polyfill-module.js": emptyPolyfill,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
