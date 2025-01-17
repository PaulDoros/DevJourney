import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: false,
    rollupOptions: {
      external: ['framer-motion'],
    },
  },
  optimizeDeps: {
    include: ['framer-motion'],
    exclude: ['@emotion/is-prop-valid'],
  },
  resolve: {
    mainFields: ['module', 'main'],
    dedupe: ['framer-motion', 'react', 'react-dom'],
  },
});
