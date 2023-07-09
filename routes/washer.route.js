const express = require('express');
const router = express.Router();
const washerController = require('../controllers/washer.controller');

router.post('/', washerController.showAll);
router.get('/:id', washerController.details);
router.post('/create', washerController.create);
router.get('/:id/edit', washerController.edit);
router.post('/:id', washerController.update);
router.delete('/:id', washerController.delete);

module.exports = router;