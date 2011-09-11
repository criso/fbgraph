/**
 * Module Dependencies
 */

var https        = require('https')
  , querystring  = require('querystring')
  , util         = require('util')
  , EventEmitter = require('events').EventEmitter
  , noop         = function(){};

/**
 * @private
 */

var accessToken = null
  , graphUrl    = 'graph.facebook.com';


/**
 * Library version
 */

exports.version = '0.1.0';



/**
 * Graph Stream
 *
 * @param {String} method
 * @param {String} url
 */
function Graph(method, url, fn) {
  EventEmitter.call(this);

  url           = this.cleanUrl(url);
  this.callback = fn || noop;
  this.body     = '';
  // this.options  = { host: exports.graphUrl , path: url };
  this.options  = { host: graphUrl , path: url };
  this[method.toLowerCase()]();

  return this;
}

util.inherits(Graph, EventEmitter);

/**
 *
 */

Graph.prototype.cleanUrl = function(url) {
  // add leading slash
  if (url.charAt(0) !== '/') url = '/' + url;

  // add access token to url
  if (accessToken) {
    url += url.indexOf('?') !== -1 ? '&' : '?';
    url += querystring.stringify(accessToken);
  }

  return url;
};

/**
 *
 * @param {Mixed} data
 */

Graph.prototype.write = function (data) {
  this.body += data;
};

/**
 * @param {object} imageData
 */

Graph.prototype.end = function (imageData) {
  var json = imageData || null
    , err  = null;

  if (!json) {
    try {
      json = JSON.parse(this.body); 
    } catch (e) {
      err = {
          error: 'Error parsing json'
        , excetpion: e
      }; 
    }
  }

  this.callback(err, json);
};

/**
 *
 */

Graph.prototype.get = function() {
  var self = this;

  https.get(this.options, function(res) {

    res.on('data', function (data) {
      self.write(data);
    });

    res.on('end', function () {
      if (res.headers['content-type'].indexOf('image') !== -1 ) {
        self.end({
            image: true
          , location: res.headers.location
        });
      } else {
        self.end();
      }
    });

  }).on('error', function (err) {
    self.callback({
        error: 'Error processing https request'
      , exception: err
    }, null);
  });

};


/**
 *
 */

exports.get = function(url, fn) {
  if (typeof url !== 'string') {
    return fn({
            error: 'Graph api url must be a string'
          }, null);
  }
  
  return new Graph('GET', url, fn);
};

/**
 *
 */

exports.search = function (options, fn) {
  options = options || {};
  var url = '/search?' + querystring.stringify(options);
  return new Graph('GET', url, fn);
};

/**
 *
 */

exports.authorizeUrl = function (opts) {
  if (!opts) {
    throw new Error('AuthorizeUrl Must have a redirectUri');
  }

  return  'https://www.facebook.com/dialog/oauth?' 
            + querystring.stringify(opts);
};

/**
 *
 */

exports.setAccessToken = function(token) {
  accessToken = { access_token: token };
};

/**
 *
 */

exports.getAccessToken = function () {
  return accessToken.access_token;
};


/**
 *
 */

exports.setGraphUrl = function (url) {
  graphUrl = url;
};

/**
 *
 */

exports.getGraphUrl = function() {
  return graphUrl;
};



// /**
//  *
//  */
// 
// exports.setAccessToken = function(config, code, fn) {
//   var callback = fn || exports.noop;
//   
//   var oAuth = new OAuth(
//       config.appId
//     , config.secret
//     , 'https://' + exports.graphUrl
//   );
// 
//   oAuth.getOAuthAccessToken(code, { 
//     redirect_uri: config.callback 
//   }, callback);
// };
