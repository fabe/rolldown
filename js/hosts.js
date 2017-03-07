'use strict';

import URL from 'url-parse';

module.exports = {
  twitter: ['twitter.com', 'www.twitter.com', 'mobile.twitter.com'],
  blacklist: ['vine.co'],
  parseURL: url => {
    let newURL = '';
    url = new URL(url);
    switch (url.hostname) {
      case 'youtu.be':
        newURL = url.href.replace('youtu.be/', 'youtube.com/watch?v=');
        return new URL(newURL);
      case 'm.youtube.com':
        newURL = url.href.replace('m.youtube.com', 'youtube.com');
        return new URL(newURL);
      default:
        return url;
    }
  },
};
