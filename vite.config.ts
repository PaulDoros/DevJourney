import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
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
    include: [
      'framer-motion',
      'lucide-react',
      '@emotion/is-prop-valid',
      '@dotlottie/react-player',
    ],
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
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || 'localhost',
    hmr: {
      port: Number(process.env.WEBSOCKET_PORT) || 8002,
      protocol: 'ws',
      host: process.env.HOST || 'localhost',
    },
  },
});
