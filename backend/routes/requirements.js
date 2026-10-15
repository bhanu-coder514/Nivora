const express = require('express');
const router = express.Router();
const {
  createRequirement, getMyRequirements, updateRequirement,
  deleteRequirement, getMatches
} = require('../controllers/requirementController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('student'), createRequirement);
router.get('/my', authenticate, authorize('student'), getMyRequirements);
router.get('/matches', authenticate, authorize('student'), getMatches);
router.put('/:id', authenticate, authorize('student'), updateRequirement);
router.delete('/:id', authenticate, authorize('student'), deleteRequirement);

module.exports = router;
