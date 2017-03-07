'use strict';

import base64 from 'base-64';

const util = {
  getExtension: url => url.split('.').pop().split(/\#|\?/)[0],
  b64: string => base64.encode(string),
};

module.exports = util;
