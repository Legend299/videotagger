const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.route('/').get(videoController.getAll).post(videoController.post);
<<<<<<< HEAD
=======
router.route('/:email').get(videoController.getFromEmail);
>>>>>>> parent of 978c676 (feat: db videws column)

module.exports = router;
