const { getDB } = require('../lib/dbConnection.js');

const { DB_NAME } = process.env;

function getAllVideos(req, res, next) {
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('videos')
      .find({}, { _id: 0 })
      .sort({ recording_date: -1 })
      .toArray()
      .then((videos) => {
        res.data = videos;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

function getOneVideo(req, res, next) {
  const { id } = req.params;
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('videos')
      .findOne({ youtube_id: id }, { _id: 0 })
      .then((video) => {
        res.data = video;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

module.exports = {
  getAllVideos,
  getOneVideo,
};
