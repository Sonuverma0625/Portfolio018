const { timingSafeEqual } = require('node:crypto');

// Protect saved messages and analytics because they contain private visitor details.
function requireAdminKey(request, response, next) {
  const expectedKey = process.env.ADMIN_API_KEY;
  const suppliedKey = request.get('X-Admin-Key') || '';

  if (!expectedKey) {
    response.status(503).json({ error: 'Admin access is not configured on this server.' });
    return;
  }

  const expectedBuffer = Buffer.from(expectedKey);
  const suppliedBuffer = Buffer.from(suppliedKey);
  const isValid = expectedBuffer.length === suppliedBuffer.length
    && timingSafeEqual(expectedBuffer, suppliedBuffer);

  if (!isValid) {
    response.status(401).json({ error: 'Enter a valid admin key to continue.' });
    return;
  }

  next();
}

module.exports = requireAdminKey;
