var querystring = require('querystring')
  , OAuth = require("oauth").OAuth2
  , request = require('request');

var CLIENT = {}
  , _facebook_graph_url = 'https://graph.facebook.com';

/* gets the authorize url
 *
 * @param {Object} options
 * @return {String}
 */
CLIENT.getAuthorizeUrl = function (options) {
  options = options || {};
  return _facebook_graph_url + '/oauth/authorize?' + querystring.stringify(options);
};

/* Does an API call to facebook and callbacks
 * when the result is available.
 *
 * @param {String} method
 * @param {String} path
 * @param {Object} params
 * @param {Function} callback
 * @return {Request}
 */
CLIENT.apiCall = function (method, path, params, callback) {
  callback = callback || function () {};

  return request({
    method: method
  , uri: _facebook_graph_url + path + '?' + querystring.stringify(params)
  }, function (error, response, body) {
    try {
      callback(error, response, JSON.parse(body));
    } catch (e) {
      callback(e);
    }
  });
};

/* Does an API call to facebook and returns
 * the request stream.
 *
 * @param {String} key
 * @param {String} secret
 * @param {String} code
 * @param {String} redirect_uri
 * @param {Function} callback
 */
CLIENT.getAccessToken = function (key, secret, code, redirect_uri, callback) {
  var oAuth = new OAuth(key, secret, _facebook_graph_url);
  oAuth.getOAuthAccessToken(code, {redirect_uri: redirect_uri}, callback);
};

module.exports = CLIENT;
