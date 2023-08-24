const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.route('/').get(tagController.getAll).put(tagController.put);
router.route('/:id').delete(tagController.del);
router.route('/:video').get(tagController.getFromVideo);

module.exports = router;
