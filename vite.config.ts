import { socketIOPlugin } from './src/lib/services/socket';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), socketIOPlugin()]
});
