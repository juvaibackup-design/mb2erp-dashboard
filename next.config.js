const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      ssr: false,
    },
  },
  reactStrictMode: false,
};

module.exports = withBundleAnalyzer(nextConfig);