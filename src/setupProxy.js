import { createProxyMiddleware } from 'http-proxy-middleware';

const proxyOptions = {
  target: 'https://m3c6d3-3000.csb.app',
  changeOrigin: true,
};

const mealsProxy = createProxyMiddleware('/meals', proxyOptions);

export default function(app) {
  app.use(mealsProxy);
}
