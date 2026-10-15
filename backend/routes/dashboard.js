const express = require('express');
const router = express.Router();
const { ownerDashboard, studentDashboard } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/owner', authenticate, authorize('owner'), ownerDashboard);
router.get('/student', authenticate, authorize('student'), studentDashboard);

module.exports = router;
