// Vercel detects Express from this root entrypoint and deploys the app as a function.
require('express');
module.exports = require('./backend/server');
