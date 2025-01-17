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
    sourcemap: true,
    rollupOptions: {
      output: {
        sourcemapExcludeSources: true,
      },
    },
    commonjsOptions: {
      include: [/framer-motion/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
  ssr: {
    noExternal: ['framer-motion'],
  },
  optimizeDeps: {
    include: ['framer-motion', '@emotion/is-prop-valid'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  server: {
    port: 8002,
    strictPort: true,
    hmr: {
      port: 8002,
    },
  },
  resolve: {
    mainFields: ['module', 'main'],
    dedupe: ['framer-motion', 'react', 'react-dom'],
  },
});
