const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.route('/').get(videoController.getAll).post(videoController.post);
<<<<<<< HEAD
<<<<<<< HEAD
=======
router.route('/:email').get(videoController.getFromEmail);
>>>>>>> parent of 978c676 (feat: db videws column)
=======
router.route('/:id').put(videoController.put);
router.route('/:email').get(videoController.getFromEmail);
>>>>>>> parent of eb5a5ce (update repo)

module.exports = router;
