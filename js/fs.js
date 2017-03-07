'use strict';

import RNFS from 'react-native-fs';
import { CameraRoll } from 'react-native';

const fs = {
  downloadVideoToCache: (url, path, updateProgress) => RNFS.downloadFile({
    fromUrl: url,
    toFile: path,
    progress: status => updateProgress(status),
  }).promise.catch(err => {
    console.log(err);
  }),
  deleteVideoFromCache: path => RNFS.unlink(path),
  saveVideo: path => CameraRoll.saveToCameraRoll(path),
};

module.exports = fs;
