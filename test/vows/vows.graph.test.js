var graph    = require('../../lib/graph')
  , FBConfig = require('../../lib/config').facebook
  , vows     = require('vows')
  , assert   = require('assert');

function includesKeys(search, obj) {
  if (!Array.isArray(search)) {
    search = [search];
  }

  var keys = Object.keys(obj);

  return keys.filter(function (elem) {
    return search.indexOf(elem) !== -1;
  }).length === search.length;
}

// Create test suite
vows.describe('Graph Api').addBatch({
  'graphApi Config': {
    topic: graph,

    'graphUrl should be graph.facebook.com': function (graph) {
      assert.ok(graph.getGraphUrl() === 'graph.facebook.com');
    }
  },

  'tests that do *not* require an access token ': {
    topic: graph,

    'shoud get public data via username': function (graph) {
      graph.get('/btaylor', function(err, res) {
        var keys = ['username', 'name', 'first_name', 'last_name'];
        assert.ok(includesKeys(keys, res)); 
      });
    },

    'bad facebook url should return error': function (graph) {
      graph.get('/thisUserNameShouldNotExist', function(err, res) {
        assert.ok(includesKeys('error', res));
      });
    },

    'should throw and error for parsing invalid json': function (graph) {
      graph.get('', function(err, res) {
        assert.equal(err.error, 'Error parsing json', 
        'Should throw an error while parsing json');
      });
    },

    'should return an error if api url is not a string': function (graph) {
      graph.get({ you: 'shall not pass' }, function(err, res) {
        assert.equal(err.error, 'Graph api url must be a string',
        'Should return an error if api url is not a string');
      });
    },

    'should get an image and return a json with its location ': function (graph) {
      graph.get('/markzuckerberg/picture', function(err, res) {
        assert.ok(includesKeys(['image', 'location'], res));
      });
    },

    'should be able to get an image using url with a missing slash': function (graph) {

      graph.get('markzuckerberg/picture', function(err, res) {
        assert.ok(includesKeys(['image', 'location'], res));
      });
    },

    'graph urls that require an access token should return an error': function (graph) {

      graph.get('/817129783203', function (err, res) {
        assert.ok(includesKeys('error', res));
        assert.equal(res.error.type, 'OAuthException',
        'Response from facebook should be an OAuthException');
      });
    }

  },

  // Tests that require an Acess Token
  // =======================================

  'test that *require* an access token': {
    topic: function () {

      var testUserUrl = '/' + FBConfig.appId + '/accounts/test-users?' + 
      'installed=true' + 
      '&name=Ricky Bobby' +
      '&permissions=' + FBConfig.scope +
      '&method=post' + 
      '&access_token=' + FBConfig.appId + '|' + FBConfig.appSecret;

      graph.get(encodeURI(testUserUrl), this.callback);
    },

    'should be able to get a test-access-token from facebook': function(err, res) {
      if (res.error 
        && res.error.message.indexOf('Service temporarily unavailable')) {

        console.error("Can't retreive access token from facebook\n" + 
        "Try again in a few minutes");
        console.log(res.error);
        process.exit(1);
      }

      var keys = ['id','access_token','login_url','email','password'];
      assert.ok(includesKeys(keys, res));

      graph.setAccessToken(res.access_token);
    },

    'access to a protected page': function(err, res) {
      graph.get('/817129783203', function (err, res) {
        assert.equal('817129783203', res.id, 'response id should be valid');
      });
    },

    'test user should have proper permissions': function (test) {

      graph.get('/me/permissions', function (err, res) {

        var permissions = FBConfig.scope
          .replace(/ /g,'')
          .split(',');

        permissions.push('installed');

        assert.ok(Array.isArray(res.data), 'response data should be an array');
        assert.ok(includesKeys(permissions, res.data[0]));
      });
    },

    'should perform a public search': function (err, res) {

      graph.search({ q: 'watermelon', type: 'post' }, function (err, res) {
        assert.ok(Array.isArray(res.data), 'response data should be an array');
        assert.ok(res.data.length > 1, 'response data should not be empty');
      });
    },

    'should perform an access token required search': function (err, res) {
      var searchOptions = {
          q:       'coffee'
        , type:    'place'
        , center:  '37.76,-122.427'
        , distance: 1000
      };

      graph.search(searchOptions, function (err, res) {
        assert.ok(Array.isArray(res.data), 'response data should be an array');
        assert.ok(res.data.length > 1, 'response data should not be empty');
      });
    }
  }
}).export(module);
