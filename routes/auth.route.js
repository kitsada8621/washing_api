const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/jwt.middleware');

router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.profile);
router.get('/logout', authMiddleware, authController.logout);

module.exports = router;