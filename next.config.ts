  import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    devIndicators: false,
    // If using older Next.js config or for full coverage:
    experimental: {
      // Some versions have a prerender indicator setting
      // @ts-ignore
      prerenderIndicator: false,
    }
  };

  export default nextConfig;
