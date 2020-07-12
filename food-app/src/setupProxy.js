const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
	console.log('from proxy hellos')
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://localhost:8000',
			changeOrigin: true,
		})
	);
};