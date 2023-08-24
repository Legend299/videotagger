const {
  getTags,
  getTagsFromVideo,
  insertTag,
  deleteTag
} = require('../services/tagService');

const getAll = async (_, res, next) => {
  console.log('Getting all tags...');
  try {
    const tags = await getTags();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

const getFromVideo = async (req, res, next) => {
  try {
    console.log(req.params.video);
    const tags = await getTagsFromVideo(req.params.video);
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

const put = async (req, res, next) => {
  try {
    const tag = await insertTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

const del = async (req, res, next) => {
  try {
    const tag = await deleteTag(req.params.id);
    res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getFromVideo,
  put,
  del
};
