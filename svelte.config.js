import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// 👇 enable fallback to make this a single-page app
			fallback: 'index.html',
			strict: false // optional: avoids the dynamic routes warning
		}),
		paths: {
			base: dev ? '' : '/search-strings'
		}
	}
};
