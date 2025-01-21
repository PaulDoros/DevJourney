import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vercelPreset } from '@vercel/remix/vite';

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
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: mode === 'development',
    rollupOptions: {
      external: ['utf-8-validate', 'bufferutil'],
      output: {
        manualChunks: {
          framer: ['framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['framer-motion', 'lucide-react', '@emotion/is-prop-valid'],
    exclude: ['@remix-run/react', 'utf-8-validate', 'bufferutil'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  ssr: {
    noExternal: ['framer-motion', 'lucide-react', '@emotion/is-prop-valid'],
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
