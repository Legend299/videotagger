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
<<<<<<< HEAD
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
=======
  console.log('insertVideo');
  const { data, error } = await supabase.from('videos').insert(video);
  if (error) {
    console.log(colors.red('Error inserting video: ' + error));
    return {
      status: 500,
      error: error
    };
  }
  return { status: 200, data: data };
>>>>>>> parent of 978c676 (feat: db videws column)
};

module.exports = {
  getVideos,
<<<<<<< HEAD
=======
  getVideosFromEmail,
>>>>>>> parent of 978c676 (feat: db videws column)
  insertVideo
};
