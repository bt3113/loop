/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === "production" ? "/loop" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/loop/" : "",
  trailingSlash: true
};

export default nextConfig;
