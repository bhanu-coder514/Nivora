const express = require('express');
const router = express.Router();
const { createInquiry, getMyInquiries, getOwnerInquiries, updateInquiryStatus } = require('../controllers/inquiryController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('student'), createInquiry);
router.get('/my', authenticate, authorize('student'), getMyInquiries);
router.get('/owner', authenticate, authorize('owner'), getOwnerInquiries);
router.patch('/:id/status', authenticate, authorize('owner'), updateInquiryStatus);

module.exports = router;
