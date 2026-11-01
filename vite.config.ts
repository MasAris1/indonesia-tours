import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];
const configuredOrigin = process.env.ORIGIN;
const trustedOrigins = configuredOrigin && !defaultOrigins.includes(configuredOrigin)
	? [...defaultOrigins, configuredOrigin]
	: defaultOrigins;

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: adapter(),
			alias: {
				$lib: 'src/lib',
				'$lib/*': 'src/lib/*'
			},
			csrf: {
				trustedOrigins
			}
		})
	]
});
