const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfile, getAllUsers } = require('../controllers/auth.controller');
const { signupValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');

router.post('/signup', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
