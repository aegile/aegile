// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   rewrites: async () => {
//     return [
//       {
//         source: '/api/auth/:path*',
//         destination: '/api/auth/:path*',
//       },
//       {
//         source: '/api/:path*',
//         destination:
//           process.env.NODE_ENV === 'development'
//             ? 'http://127.0.0.1:5328/api/:path*'
//             : '/api/',
//       },
//     ];
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'unsplash.it',
//       },
//     ],
//   },
//   experimental: {
//     serverActions: {
//       // edit: updated to new key. Was previously `allowedForwardedHosts`
//       allowedOrigins: ['localhost:3000', 'aegile.vercel.app'],
//     },
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/py/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/api/py/:path*'
            : '/api/',
      },
      {
        source: '/docs',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/api/py/docs'
            : '/api/py/docs',
      },
      {
        source: '/openapi.json',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/api/py/openapi.json'
            : '/api/py/openapi.json',
      },
    ];
  },
};

module.exports = nextConfig;
