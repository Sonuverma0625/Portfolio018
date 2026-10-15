const express = require('express');
const rateLimit = require('express-rate-limit');
const portfolioController = require('../controllers/portfolio-controller');
const contactController = require('../controllers/contact-controller');
const adminController = require('../controllers/admin-controller');

const router = express.Router();
const CONTACT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_REQUEST_LIMIT = 5;
const VISIT_WINDOW_MS = 15 * 60 * 1000;
const VISIT_REQUEST_LIMIT = 120;
const contactLimiter = rateLimit({
  windowMs: CONTACT_WINDOW_MS,
  limit: CONTACT_REQUEST_LIMIT,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many messages were sent. Please wait a little and try again.' },
});
const visitLimiter = rateLimit({
  windowMs: VISIT_WINDOW_MS,
  limit: VISIT_REQUEST_LIMIT,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

router.get('/', (request, response) => {
  response.json({ name: 'Portfolio API', status: 'running' });
});
router.get('/portfolio', portfolioController.getPortfolio);
router.get('/projects', portfolioController.getProjects);
router.get('/projects/:id', portfolioController.getProject);
router.get('/skills', portfolioController.getSkills);
router.get('/certificates', portfolioController.getCertificates);
router.get('/experience', portfolioController.getExperience);
router.post('/contact', contactLimiter, contactController.createContactMessage);
router.post('/analytics/visit', visitLimiter, adminController.recordVisit);

module.exports = router;
