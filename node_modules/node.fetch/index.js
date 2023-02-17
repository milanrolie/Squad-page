/**
 * Creator: yeliex <yeliex@yeliex.com>
 * Description: ajax for node.js
 */
const fetch = require("node-fetch");
const co = require("co");

const errorDetect = function (code, rule) {
  return !!code || (code >= 200 && code < 400) || (code === "success") || (code === "SUCCESS") || (code === rule);
};

const factory = function *(url, params, result = true) {
  const response = yield fetch(url, params);

  const successRule = params ? (params.successRule || null) : null;

  const isJson = response.headers.get('content-type').search(/json/g) >= 0;

  var that = {
    response,
    isJson
  };

  that.status = errorDetect(response.status, successRule);
  that.statusText = response.statusText;

  if (isJson) {
    that.data = yield response.json();
    that.data.status = that.status ? that.status : errorDetect(that.data.status);
    that.data.statusText = response.statusText;
  } else {
    that.data = yield response.text();
  }

  if (result) {
    return isJson ? that.data : {
      data: that.data,
      status: that.status,
      statusText: that.statusText
    };
  }
  return that;
};

module.exports = factory;