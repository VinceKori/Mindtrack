// src/setupProxy.js
// This file is automatically loaded by Create React App's webpack dev server
// It proxies API requests to avoid CORS issues during development

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy requests from /api/verse to the OurManna Bible API
  app.use(
    '/api/verse',
    createProxyMiddleware({
      target: 'https://beta.ourmanna.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/verse': '/api/v1/get?format=json', // Rewrite path
      },
      onProxyReq: (proxyReq) => {
        // Log the proxied request for debugging
        console.log('[Proxy] Forwarding request to OurManna API');
      },
      onProxyRes: (proxyRes) => {
        // Log successful response
        console.log('[Proxy] Received response from OurManna API');
      },
      onError: (err, req, res) => {
        console.error('[Proxy] Error:', err.message);
        res.status(500).json({ error: 'Proxy error' });
      },
    })
  );
};
