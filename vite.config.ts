import { socketIOPlugin } from './src/lib/socket';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), socketIOPlugin()]
});
