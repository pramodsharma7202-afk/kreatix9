/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Reduce initial JS payload by splitting large vendor chunks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate framer-motion into its own chunk so it's only loaded on pages that need it
          framerMotion: {
            name: 'framer-motion',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            chunks: 'async',
            priority: 20,
          },
          // Separate socket.io from the main bundle
          socketio: {
            name: 'socket-io',
            test: /[\\/]node_modules[\\/](socket\.io-client|engine\.io-client)[\\/]/,
            chunks: 'async',
            priority: 20,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
