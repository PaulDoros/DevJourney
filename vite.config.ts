import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vercelPreset } from '@vercel/remix/vite';

declare module '@remix-run/node' {
  interface Future {
    v3_fetcherPersist: true;
    v3_relativeSplatPath: true;
    v3_throwAbortReason: true;
    v3_singleFetch: true;
    v3_lazyRouteDiscovery: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
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
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: ['framer-motion', 'lucide-react', '@emotion/is-prop-valid'],
  },
  ssr: {
    noExternal: ['framer-motion', 'lucide-react', '@emotion/is-prop-valid'],
  },
  resolve: {
    mainFields: ['module', 'main'],
    dedupe: ['framer-motion', 'react', 'react-dom', 'lucide-react'],
  },
});
