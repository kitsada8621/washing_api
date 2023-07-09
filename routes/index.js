const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');
const authMiddleware = require('../middleware/jwt.middleware');

router.get('/', homeController.index);
router.use('/', require('./auth.route'));
router.use('/washer', authMiddleware, require('./washer.route'));
router.use('/provider', require('./provider.route'));
router.use('/order', require('./order.route'));

module.exports = router;