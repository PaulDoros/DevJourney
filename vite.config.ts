import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: mode === 'development',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          framer: ['framer-motion'],
          lottie: ['@dotlottie/react-player'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'framer-motion',
      'lucide-react',
      '@emotion/is-prop-valid',
      '@dotlottie/react-player',
    ],
    exclude: ['@remix-run/react'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  ssr: {
    noExternal: [
      'framer-motion',
      'lucide-react',
      '@emotion/is-prop-valid',
      '@dotlottie/react-player',
    ],
    target: 'node',
    format: 'esm',
  },
  resolve: {
    alias: {
      '~': '/app',
    },
    mainFields: ['module', 'main', 'browser'],
  },
  server: {
    fs: {
      strict: true,
    },
  },
}));
