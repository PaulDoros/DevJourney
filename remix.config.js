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
    port: 8002,
    rebuildPollIntervalMs: 3000,
  },
};
