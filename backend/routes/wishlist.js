const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('student'), getWishlist);
router.post('/:propertyId', authenticate, authorize('student'), addToWishlist);
router.delete('/:propertyId', authenticate, authorize('student'), removeFromWishlist);

module.exports = router;
