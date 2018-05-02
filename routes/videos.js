const router = require('express').Router();
const videoModel = require('../models/video.js');

function sendAsJSON(req, res) {
  res.json(res.data);
}

router.route('/')
  .get(videoModel.getAllVideos, sendAsJSON);

router.route('/:id')
  .get(videoModel.getOneVideo, sendAsJSON);

module.exports = router;
