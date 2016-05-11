'use strict';

var ajax = require('../browserify-wrapper/ajax.js');

module.exports =function upload(uploadInfo, data, file, saveOptions) {
  file.attributes.url = uploadInfo.url;
  file._bucket = uploadInfo.bucket;
  file.id = uploadInfo.objectId;
  var uploadUrl = uploadInfo.upload_url + "?sign=" + encodeURIComponent(uploadInfo.token);
  var formData = new FormData();
  formData.append('fileContent', data);
  formData.append('op', 'upload');

  return ajax('POST', uploadUrl, formData, undefined, saveOptions.onProgress)
    .then(() => file);
};