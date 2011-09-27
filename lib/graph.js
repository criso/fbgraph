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

var accessToken =  null
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
 * @param {object/function} - postData 
 * - object to be used for post
 * - assumed to be a callback function if callback is undefined
 * @param {function/undefined} - callback function 
 */

function Graph(method, url, postData, callback) {
  EventEmitter.call(this);

  if (typeof callback === 'undefined') {
    callback  = postData;
    postData  = {};
  }

  url           = this.cleanUrl(url);
  this.callback = callback || noop;
  this.body     = "";
  this.postData = postData;
  this.options  = { host: graphUrl , path: url };
  this[method.toLowerCase()]();

  return this;
}

util.inherits(Graph, EventEmitter);

/**
 * @param {string} url string
 */

Graph.prototype.cleanUrl = function(url) {
  // add leading slash
  if (url.charAt(0) !== '/') url = '/' + url;

  // add access token to url
  if (accessToken) {
    url += ~indexOf('?') ? '&' : '?';
    url += "access_token=" + accessToken;
  }

  return url;
};

/**
 * write stream  
 * @param {Mixed} data
 */

Graph.prototype.write = function (data) {
  this.body += data;
};

/**
 * Gets called on response.end
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
 * https.get wrapper
 * if response is an image 
 * e.g. FB redirects profile image requests directly to the image
 * we'll send back json containing  {image: true, location: imageLocation }
 */

Graph.prototype.get = function() {
  var self = this;

  https.get(this.options, function(res) {
    res.setEncoding('utf-8');

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
 * https.post wrapper
 */

Graph.prototype.post = function() {
  var postData = querystring.stringify(this.postData);

  var self             = this;
  this.options.method  = 'POST';
  this.options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length
  };

  var req = https.request(this.options, function(res) {
      res.setEncoding('utf-8');

      res.on('data', function (data) {
        self.write(data);
      });

      res.on('end', function () {
          self.end();
      });
  
  })
  .on('error', function (err) {
    self.callback({
        error: 'Error processing https request'
      , exception: err
    }, null);
  });

  req.write(postData);
  req.end();
};


/**
 * Accepts an url an returns facebook 
 * json data to the callback provided
 * @param {string} url
 * @param {function} callback
 */

exports.get = function(url, callback) {
  if (typeof url !== 'string') {
    return callback({
            error: 'Graph api url must be a string'
          }, null);
  }
  
  return new Graph('GET', url, callback);
};

/**
 * Accepts an url, post data an returns facebook 
 * json data to the callback provided
 * @param {string} url
 * @param {object} postData
 * @param {function} callback
 */

exports.post = function (url, postData, callback) {
  if (typeof url !== 'string') {
    return callback({
            error: 'Graph api url must be a string'
          }, null);
  }
  
  if (typeof callback === 'undefined') {
    callback = postData;
    postData = { access_token: accessToken };
  }

  return new Graph('POST', url, postData, callback);
};

/**
 * Deletes an object from via the graph api
 * by sending a "DELETE", which is really 
 * a post call, along with a method=delete param
 *
 * @param {string} url
 * @param {function} callback
 */

exports.del = function (url, callback) {
  if (!url.match(/[?|&]method=delete/i)) {
    url += url.indexOf('?') !== -1 ? '?' : '&';
    url += 'method=delete';
  }

  this.post(url, callback);
};


/**
 * Perform a search on the graph api
 *
 * @param {object} options (search options)
 * @param {function} callback
 */

exports.search = function (options, callback) {
  options = options || {};
  var url = '/search?' + querystring.stringify(options);
  return this.get(url, callback);
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
 * Sets the access token
 * @param {string} token
 */

exports.setAccessToken = function(token) {
  accessToken = token;
  return this;
};

/**
 * @returns the access token
 */

exports.getAccessToken = function () {
  return accessToken;
};


/**
 * sets graph url 
 */

exports.setGraphUrl = function (url) {
  graphUrl = url;
};

/**
 * @returns the graphUrl
 */

exports.getGraphUrl = function() {
  return graphUrl;
};
