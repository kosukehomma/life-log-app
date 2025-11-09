import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig ({
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                form: './form.html',
            },
        },
    },
    plugins: [tsconfigPaths()],
});
