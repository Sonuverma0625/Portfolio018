const express = require('express');
const adminController = require('../controllers/admin-controller');
const requireAdminKey = require('../middleware/admin-key');

const router = express.Router();
router.use(['/messages', '/analytics'], requireAdminKey);
router.get('/messages', adminController.getMessages);
router.put('/messages/:id/read', adminController.markMessageRead);
router.delete('/messages/:id', adminController.deleteMessage);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
