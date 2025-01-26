/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'esm',
  serverBuildPath: 'build/server/index.js',
  assetsBuildDirectory: 'build/client',
  publicPath: '/build/',
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    v3_singleFetch: true,
  },
  dev: {
    // Use default port for app server
    port: 3000,
    // Reduce rebuild poll interval for better performance
    rebuildPollIntervalMs: 1000,
    // Set the HTTP scheme
    httpScheme: 'http',
    // Set the hostname
    hostname: 'localhost',
  },
};
