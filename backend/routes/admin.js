const express = require('express');
const router = express.Router();
const {
  getDashboard, getUsers, getProperties,
  updateUserStatus, deleteProperty
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/properties', getProperties);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/properties/:id', deleteProperty);

module.exports = router;
