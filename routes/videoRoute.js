const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const videoController = require('../controllers/videoController');

router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.post('/:id/trim', videoController.trimVideo);
router.post('/videos/:id/subtitles',videoController.addSubtitles)
router.get('/render/:id',videoController.renderFinalVideo)
router.get('/videos/:id/download',videoController.downloadFinalVideo)
module.exports = router;
