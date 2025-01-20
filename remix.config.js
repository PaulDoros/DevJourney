/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'cjs',
  serverBuildPath: 'build/server/index.js',
  assetsBuildDirectory: 'build/client',
  publicPath: '/build/',
  dev: {
    port: process.env.PORT || 3000,
    hmr: {
      port: process.env.WEBSOCKET_PORT || 8002,
    },
  },
  future: {
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
