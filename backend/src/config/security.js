const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3002,http://127.0.0.1:3002')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    imgSrc: ["'self'", 'data:', 'blob:'],
    objectSrc: ["'none'"],
    scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  },
};

module.exports = { allowedOrigins, contentSecurityPolicy };
