import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function spaRoutesPlugin(): Plugin {
  return {
    name: 'spa-routes-generator',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      const routes = ['genesis', 'pantheon', 'mnemosyne', 'hermes'];
      routes.forEach((route) => {
        const routeDir = path.join(outDir, route);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        fs.copyFileSync(indexPath, path.join(routeDir, 'index.html'));
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), spaRoutesPlugin()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          anime: ['animejs'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
