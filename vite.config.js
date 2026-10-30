import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const variables = loadEnv(mode, process.cwd(), 'VITE_');
  const urlApi = process.env.VITE_EXPRESS || variables.VITE_EXPRESS;

  if (mode === 'production' && !urlApi?.trim()) {
    throw new Error('VITE_EXPRESS debe configurarse con la URL pública de la API antes de compilar para producción.');
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };
});
