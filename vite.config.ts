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
    rollupOptions: {
      external: ['framer-motion'],
    },
  },
  optimizeDeps: {
    include: [
      'framer-motion',
      'lucide-react',
      '@emotion/is-prop-valid',
      '@supabase/supabase-js',
    ],
  },
  ssr: {
    noExternal: [
      'lucide-react',
      '@emotion/is-prop-valid',
      '@supabase/supabase-js',
      '@supabase/auth-helpers-remix',
      '@web3-storage/multipart-parser',
    ],
  },
  resolve: {
    mainFields: ['module', 'main'],
    dedupe: ['framer-motion', 'react', 'react-dom', 'lucide-react'],
  },
});
