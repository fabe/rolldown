'use strict';

import { twitter } from './credentials';
import { b64 } from './util';

const twitterApi = {
  getTwitterToken: () => fetch('https://api.twitter.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${b64(`${twitter.key}:${twitter.secret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials',
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors) throw 'Unable to verify Twitter credentials.';
      return data.access_token;
    }),
  getTwitterVideo: (id, bearer) =>
    fetch(
      `https://api.twitter.com/1.1/statuses/show.json?id=${id}&tweet_mode=extended&include_entities=true&`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      }
    )
      .then(res => res.json())
      .then(data => {
        if (data.extended_entities.media[0].type != 'video')
          throw 'Not a video!';
        let mp4 = { url: '', bitrate: 0 };
        data.extended_entities.media[0].video_info.variants.forEach(video => {
          if (video.content_type === 'video/mp4' && video.bitrate > mp4.bitrate)
            mp4 = video;
        });
        return mp4.url;
      }),
};

module.exports = twitterApi;
