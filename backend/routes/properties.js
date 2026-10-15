const express = require('express');
const router = express.Router();
const {
  createProperty, getProperties, getProperty,
  updateProperty, deleteProperty, getOwnerProperties
} = require('../controllers/propertyController');
const { authenticate, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getProperties);
router.get('/owner/my', authenticate, authorize('owner'), getOwnerProperties);
router.get('/:id', getProperty);
router.post('/', authenticate, authorize('owner'), upload.array('images', 10), createProperty);
router.put('/:id', authenticate, authorize('owner'), upload.array('images', 10), updateProperty);
router.delete('/:id', authenticate, deleteProperty);

module.exports = router;
