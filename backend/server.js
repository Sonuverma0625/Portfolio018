const path = require('node:path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const publicRoutes = require('./src/routes/public-routes');
const adminRoutes = require('./src/routes/admin-routes');
const { allowedOrigins, contentSecurityPolicy } = require('./src/config/security');

const PORT = Number(process.env.PORT) || 3002;
const FRONTEND_PATH = path.join(__dirname, '..', 'frontend');
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('This website is not allowed to use the portfolio API.'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Key'],
}));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

app.use('/api', publicRoutes);
app.use('/api', adminRoutes);
app.use(express.static(FRONTEND_PATH, { extensions: ['html'] }));

// Return JSON errors without exposing stack traces to site visitors.
app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const statusCode = error.status || (error.type === 'entity.too.large' ? 413 : 500);
  response.status(statusCode).json({ error: statusCode === 500 ? 'The server could not complete that request.' : error.message });
});

app.listen(PORT, () => {
  process.stdout.write(`Portfolio server ready at http://localhost:${PORT}\n`);
});
