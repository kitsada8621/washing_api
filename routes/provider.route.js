const express = require('express');
const router = express.Router();
const providerController = require('../controllers/provider.controller');

router.get('/:id', providerController.details);
router.post('/', providerController.showAll);

module.exports = router;