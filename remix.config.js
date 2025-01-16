/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'esm',
  dev: {
    port: 8002,
    rebuildPollIntervalMs: 3000,
  },
};
