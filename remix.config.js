/** @type {import('@remix-run/dev').AppConfig} */
export default {
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    v3_singleFetch: true,
    v3_lazyRouteDiscovery: true,
  },
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'esm',
  dev: {
    port: 8002,
    rebuildPollIntervalMs: 3000,
  },
};
