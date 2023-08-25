<<<<<<< HEAD
<<<<<<< HEAD
const { getVideos, insertVideo } = require('../services/videoService');
=======
const {
  getVideos,
  getVideosFromEmail,
  insertVideo
} = require('../services/videoService');
>>>>>>> parent of 978c676 (feat: db videws column)
=======
const {
  getVideos,
  getVideosFromEmail,
  insertVideo,
  updateViewCount
} = require('../services/videoService');
>>>>>>> parent of eb5a5ce (update repo)

const getAll = async (_, res, next) => {
  try {
    const videos = await getVideos();
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

const getFromEmail = async (req, res, next) => {
  try {
    const videos = await getVideosFromEmail(req.params.email);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

const post = async (req, res, next) => {
  try {
    const video = await insertVideo(req.body);
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

const put = async (req, res, next) => {
  try {
    const video = await updateViewCount(req.params.id);
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
<<<<<<< HEAD
<<<<<<< HEAD
=======
  getFromEmail,
>>>>>>> parent of 978c676 (feat: db videws column)
  post
=======
  getFromEmail,
  post,
  put
>>>>>>> parent of eb5a5ce (update repo)
};
