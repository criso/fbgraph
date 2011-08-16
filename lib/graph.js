/**
 * Module Dependencies
 */

var https        = require('https')
  , util         = require('util')
  , EventEmitter = require('events').EventEmitter
  , noop         = function(){};


/**
 * Library version
 */

exports.version = '0.1.0';


/**
 * Graph api url
 */

exports.graphUrl = 'graph.facebook.com';

/**
 *
 */
exports.accessToken = null;

/**
 * Request Stream
 *
 * @param {String} method
 * @param {String} url
 */
function Request(method, url, fn) {
  EventEmitter.call(this);

  this.callback = fn || noop;
  this.body    = '';
  this.options = { host: exports.graphUrl , path: url };
  this[method.toLowerCase()]();

  return this;
}

util.inherits(Request, EventEmitter);

/**
 *
 * @param {Mixed} data
 */

Request.prototype.write = function (data) {
  this.body += data;
};

/**
 *
 */

Request.prototype.end = function (imageData) {
  var json = imageData || null
    , err  = null;
  
  if (!json) {
    try {
      json = JSON.parse(this.body); 
    } catch (e) {
      err = {
        error: 'Error parsing json',
        excetpion: e
      }; 
    }
  }

  this.callback(err, json);
};


/**
 *
 */

Request.prototype.get = function() {
  var self = this;

  https.get(this.options, function(res) {

    res.on('data', function (data) {
      if (!self.write(data)) {
        res.pause(); 
      } 
    });

    self.on('drain', function () {
      console.log('drain');
      res.resume();
    });

    res.on('end', function() {
      if (res.headers['content-type'].indexOf('image') !== -1 ) {
        self.end({ 
          image: true , 
          location: res.headers.location 
        });
      } else {
        self.end(); 
      }
    });

  }).on('error', function (err) {
    self.callback({
      error: 'Error processing https request',
      exception: err
    });
  });
};


/**
 *
 */

exports.get = function(url, fn) {
  var req = new Request('GET', url, fn);
};


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

exports.setAccessToken = function(config, code, fn) {
  var callback = fn || exports.noop;
  
  var oAuth = new OAuth(
      config.appId
    , config.secret
    , 'https://' + exports.graphUrl
  );

  oAuth.getOAuthAccessToken(code, { 
    redirect_uri: config.callback 
  }, callback);

};
