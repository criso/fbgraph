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
  , graphUrl  = 'graph.facebook.com';

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
 * "Cleans" given url string
 * - adds lading slash
 * - adds access token if we have one
 * @param {string} url string
 */

Graph.prototype.cleanUrl = function(url) {
  // add leading slash
  if (url.charAt(0) !== '/') url = '/' + url;

  // add access token to url
  if (accessToken) {
    url += ~url.indexOf('?') ? '&' : '?';
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
          message: 'Error parsing json'
        , exception: e
      };
    }
  }

  if (!err && (json && json.error)) err = json.error;

  this.callback(err, json);
};

/**
 * https.get wrapper
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
        message: 'Error processing https request'
      , exception: err
    }, null);
  });

};

/**
 * https.post wrapper
 *  
 */

Graph.prototype.post = function() {

  var self     = this
    , postData = querystring.stringify(this.postData);

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
        message: 'Error processing https request'
      , exception: err
    }, null);
  });

  req.write(postData);
  req.end();
};

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 */

exports.serialize = function (obj) {
  var pairs = [];

  for (var key in obj) {
    pairs.push(encodeURIComponent(key)
      + '=' + encodeURIComponent(obj[key]));
  }

  return pairs.join('&');
};


/**
 * Accepts an url an returns facebook 
 * json data to the callback provided
 *
 * if the response is an image 
 * ( FB redirects profile image requests directly to the image )
 * We'll send back json containing  {image: true, location: imageLocation }
 *
 * Ex:
 *
 *    Passing params directly in the url
 *
 *      graph.get("zuck?fields=picture", callback)
 *
 *    OR
 *
 *      var params = { fields: picture };
 *      graph.get("zuck", params, callback);
 *
 *    GraphApi calls that redirect directly to an image
 *    will return a json response with relavant fields
 *
 *      graph.get("/zuck/picture", callback);
 *
 *      {
 *      image: true,
 *      location: "http://profile.ak.fbcdn.net/hprofile-ak-snc4/157340_4_3955636_q.jpg"
 *      }
 *
 *
 * @param {object} params
 * @param {string} url
 * @param {function} callback
 */

exports.get = function(url, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params   = null;
  }

  if (typeof url !== 'string') {
    return callback({ error: 'Graph api url must be a string' }, null);
  }

  if (params)  url += '?' + this.serialize(params);

  // graph.get(testUserUrl, params, function(err, res) {
  return new Graph('GET', url, callback);
};

/**
 * Publish to the facebook graph
 *
 * Ex:
 *    // access token will be needed for posts
 *    graph.setAccessToken(accessToken);
 *
 *    var wallPost = { message: "heyooo budday" };
 *    graph.post(friendID + "/feed", wallPost, callback);
 *
 * @param {string} url
 * @param {object} postData
 * @param {function} callback
 */

exports.post = function (url, postData, callback) {
  if (typeof url !== 'string') {
    return callback({ error: 'Graph api url must be a string' }, null);
  }

  if (typeof postData === 'function') {
    callback = postData;
    postData = { access_token: accessToken };
  }

  return new Graph('POST', url, postData, callback);
};

/**
 * Deletes an object from the graph api
 * by sending a "DELETE", which is really
 * a post call, along with a method=delete param
 *
 * @param {string} url
 * @param {function} callback
 */

exports.del = function (url, callback) {
  if (!url.match(/[?|&]method=delete/i)) {
    url += ~url.indexOf('?') ? '?' : '&';
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
