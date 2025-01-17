import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [remix()],
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
    optimizeDeps: {
      disabled: false,
    },
  },
  resolve: {
    mainFields: ['module', 'main'],
    dedupe: ['framer-motion', 'react', 'react-dom', 'lucide-react'],
  },
});
