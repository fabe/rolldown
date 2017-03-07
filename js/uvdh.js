'use strict';

const uvdh = {
  fetchVideo: url => fetch(
    `https://helloacm.com/api/video/?cached&video=${url}`
  )
    .then(res => {
      if (res.status == 200) {
        return res.json();
      } else {
        return { error: res.status };
      }
    })
    .then(data => data),
};

module.exports = uvdh;
