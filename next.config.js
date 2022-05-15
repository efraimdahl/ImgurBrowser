module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/twitter/search',
        destination: 'https://api.twitter.com',
      },
    ]
  },
};