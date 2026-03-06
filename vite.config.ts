import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                terms: resolve(__dirname, 'terms.html'),
                tr_terms: resolve(__dirname, 'tr_terms.html'),
                aydinlatmametni: resolve(__dirname, 'aydinlatmametni.html'),
            },
        },
    },
});
