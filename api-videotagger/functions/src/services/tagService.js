const supabase = require('./dbService');
const colors = require('../utils/colors');

const axios = require('axios');
const https = require('https');
// const { java_api } = require('../config/config');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const instance = axios.create({
  httpsAgent
});

const getTags = async () => {
  console.log('getTags');
  const { data, error } = await supabase.from('tags').select('*, videos(*)');
  if (error) {
    console.log(colors.red('Error getting tags: ' + error));
    return {
      status: 500,
      error: error
    };
  }
  return { status: 200, data: data };
};

const getTagsFromVideo = async (video) => {
  try {
    const response = await await instance.get(
      'https://videotagger.borrego-research.com/api/videos'
    );
    const foundItem = response.data.find(
      (item) => item.artifactLocation === video
    );

    // Remove leading white spaces from timestamps
    const cleanedTimestamps = foundItem?.artifactTagsTimestamp?.map((tag) => ({
      tag: tag.tag,
      timestamp: tag.timestamp.trim() // Use trim() to remove leading and trailing white spaces
    }));

    return { status: 200, data: cleanedTimestamps };
  } catch (error) {
    console.error(error);
    return { status: 500, error: 'Internal Server Error' };
  }
};

const insertTag = async (tag) => {
  try {
    const response = await instance.put(
      'https://videotagger.borrego-research.com/api/videos/tag',
      tag
    );
    return { status: 200, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error, error: error };
  }
};

// const getTagsFromVideoAndEmail = async (video, email) => {
//   // get video id
//   const { data: videos, error: errorVideo } = await supabase
//     .from('videos')
//     .select()
//     .eq('url', video)
//     .order('id', { ascending: false });

//   if (errorVideo) {
//     console.log(colors.red('Error getting videos: ' + errorVideo));
//     return {
//       status: 500,
//       error: errorVideo
//     };
//   }

//   // insert name according to email
//   const { data: users, error: errorUsers } = await supabase
//     .from('users')
//     .select();
//   if (errorUsers) {
//     console.log(colors.red('Error getting users: ' + errorUsers));
//     return {
//       status: 500,
//       error: errorUsers
//     };
//   }

//   // get tags
//   const { data, error } = await supabase
//     .from('tags')
//     .select()
//     .eq('video', videos[0]?.id)
//     .order('timestamp', { ascending: true });

//   if (error) {
//     console.log(colors.red('Error getting tags: ' + error));
//     return {
//       status: 500,
//       error: error
//     };
//   }

//   data.forEach((tag) => {
//     const user = users.find((user) => user.email === tag.user);
//     tag.user_name = user.name;
//   });

//   if (error) {
//     console.log(colors.red('Error getting tags: ' + JSON.stringify(error)));
//     return {
//       status: 500,
//       error: error
//     };
//   }

//   const orderedData = data.sort((a, b) => {
//     const aTime = a.timestamp.split(':');
//     const bTime = b.timestamp.split(':');

//     const secondsInHour = 3600;
//     const secondsInMinute = 60;

//     if (aTime.length === 3 && bTime.length === 3) {
//       return (
//         parseInt(aTime[0]) * secondsInHour +
//         parseInt(aTime[1]) * secondsInMinute +
//         parseInt(aTime[2]) -
//         (parseInt(bTime[0]) * secondsInHour +
//           parseInt(bTime[1]) * secondsInMinute +
//           parseInt(bTime[2]))
//       );
//     } else if (aTime.length === 2 && bTime.length === 2) {
//       return (
//         parseInt(aTime[0]) * secondsInMinute +
//         parseInt(aTime[1]) -
//         (parseInt(bTime[0]) * secondsInMinute + parseInt(bTime[1]))
//       );
//     } else {
//       return 0;
//     }
//   });

//   return { status: 200, data: orderedData };
// };

const deleteTag = async (tag) => {
  const { data: videoId, error: errorTag } = await supabase
    .from('tags')
    .select()
    .eq('id', tag);
  if (errorTag) {
    console.log(colors.red('Error getting tags: ' + errorTag));
    return {
      status: 500,
      error: errorTag
    };
  }

  const { data, error } = await supabase.from('tags').delete().eq('id', tag);
  if (error) {
    console.log(colors.red('Error deleting tags: ' + error));
    return {
      status: 500,
      error: error
    };
  }

  const { data: tags, error: errorTags } = await supabase
    .from('tags')
    .select()
    .eq('video', videoId[0].video);
  if (errorTags) {
    console.log(colors.red('Error getting tags: ' + errorTags));
    return {
      status: 500,
      error: errorTags
    };
  }

  if (tags.length === 0) {
    const { data, error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId[0].video);
    if (error) {
      console.log(colors.red('Error deleting video: ' + error));
      return {
        status: 500,
        error: error
      };
    }
  }
  return { status: 200, data: data };
};

const validateVideo = async (info) => {
  console.log(colors.blue('Validating video...'));
  console.log(colors.blue('Video info: ' + JSON.stringify(info)));
  const { data: existingVideos, error: errorExistingVideos } = await supabase
    .from('videos')
    .select()
    .eq('url', info.video);
  if (errorExistingVideos) {
    console.log(
      colors.red('Error getting existing videos: ' + errorExistingVideos)
    );
    return {
      status: 500,
      error: errorExistingVideos
    };
  }
  if (existingVideos.length > 0) {
    console.log(colors.yellow('Video already exists'));
    console.log(colors.yellow('Existing videos: ' + existingVideos));
    return { status: 200, data: existingVideos };
  } else {
    console.log(colors.blue('Video does not exist'));
    const { data: newVideos, error: errorNewVideos } = await supabase
      .from('videos')
      .insert({
        title: info.videoTitle,
        url: info.video,
        email: info.user
      })
      .select();
    if (errorNewVideos) {
      console.log(colors.red('Error inserting new video: ' + errorNewVideos));
      return {
        status: 500,
        error: errorNewVideos
      };
    }
    return { status: 200, data: newVideos };
  }
};

module.exports = {
  getTags,
  // getTagsFromVideoAndEmail,
  getTagsFromVideo,
  insertTag,
  deleteTag
};
