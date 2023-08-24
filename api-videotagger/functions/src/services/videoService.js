const axios = require('axios');
const https = require('https');
// const { java_api } = require('../config/config');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const instance = axios.create({
  httpsAgent
});

const getVideos = async () => {
  try {
    const response = await instance.get(
      'https://videotagger.borrego-research.com/api/videos'
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 500, error: 'Internal Server Error' };
  }
};

const insertVideo = async (video) => {
  try {
    const response = await instance.post(
      'https://videotagger.borrego-research.com/api/videos/save',
      video
    );
    return { status: 200, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error, error: error };
  }
};

module.exports = {
  getVideos,
  insertVideo
};
