import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      }
    }), 
    tsconfigPaths()
  ],
  build: {
    rollupOptions: {
      external: [],
    },
    sourcemap: true
  },
  optimizeDeps: {
    include: [
      'framer-motion',
      'lucide-react',
      '@emotion/is-prop-valid',
      '@dotlottie/react-player',
    ],
    exclude: ['@remix-run/react'],
  },
  ssr: {
    noExternal: [
      'framer-motion',
      'lucide-react',
      '@emotion/is-prop-valid',
      '@dotlottie/react-player',
    ],
  },
  resolve: {
    alias: {
      '~': '/app',
    },
  },
  server: {
    fs: {
      strict: true
    }
  }
});
