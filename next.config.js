module.exports = {
  async redirects() {
    return [
      {
        source: '/@:username',
        destination: '/:username',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  // Enable features for improved SEO and performance
  experimental: {
    optimizeFonts: true
  },
  // Configure image optimization
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com']
  },
  // Enable compression for better performance
  compress: true,
  // Add poweredByHeader false to remove X-Powered-By header for security
  poweredByHeader: false
}