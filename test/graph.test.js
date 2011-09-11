var graph    = require('../lib/graph')
  , FBConfig = require('../lib/config').facebook;

function includesKeys(search, obj) {
  if (!Array.isArray(search)) {
  search = [search];
  }

  var keys = Object.keys(obj);

  return keys.filter(function (elem) {
    return search.indexOf(elem) !== -1;
  }).length === search.length;
}

module.exports = {

  'graphUrl should be graph.facebook.com': function (test) {
    test.expect(1);
    test.ok(graph.getGraphUrl() === 'graph.facebook.com');
    test.done();
  },

  'test retrieving data from the api': function (test) {
    test.expect(1);

    graph.get('/btaylor', function(err, res) {
      test.ok(includesKeys(['username', 'name', 'first_name', 'last_name'], res));
      test.done();
    });
  },

  'test bad facebook url should return error': function (test) {
    test.expect(1);

    graph.get('/thisUserNameShouldNotExist', function(err, res) {
      test.ok(includesKeys('error', res));
      test.done();
    });
  },

  'should throw and error for parsing invalid json': function (test) {
    test.expect(1);

    graph.get('', function(err, res) {
      test.equal(err.error, 'Error parsing json', 
      'Should throw an error while parsing json');
      test.done();
    });
  },

  'should return an error for invalid url': function (test) {
    test.expect(1);

    var url      = graph.graphUrl;
    graph.graphUrl = '###';

    graph.get('', function(err, res) {
      test.equal(err.error, 'Error processing https request', 
      'Should return an error processing the https request');

      graph.graphUrl = url;
      test.done();
    });
  },

  'should return an error if api url is not a string': function (test) {
    test.expect(1);

    graph.get({ you: 'shall not pass' }, function(err, res) {
      test.equal(err.error, 'Graph api url must be a string',
      'Should return an error if api url is not a string');

      test.done();
    });
  },

  'should get an image and return a json with its location ': function (test) {
    test.expect(1);

    graph.get('/markzuckerberg/picture', function(err, res) {
      test.ok(includesKeys(['image', 'location'], res));
      test.done();
    });
  },

  'should be able to get an image using url with a missing slash': function (test) {
    test.expect(1);

    graph.get('markzuckerberg/picture', function(err, res) {
      test.ok(includesKeys(['image', 'location'], res));
      test.done();
    });
  },

  'graph urls that require a token should return an error': function (test) {
    test.expect(2);

    graph.get('/817129783203', function (err, res) {
      test.ok(includesKeys('error', res));
      test.equal(res.error.type, 'OAuthException',
      'Response from facebook should be an OAuthException');

      test.done();
    });
  },

  // Tests that require an Acess Token
  // =======================================

  'should get a valid access token': function (test) {
    test.expect(1);

    var testUserUrl = '/' + FBConfig.appId + '/accounts/test-users?' + 
      'installed=true' + 
      '&name=Ricky Bobby' +
      '&permissions=' + FBConfig.scope +
      '&method=post' + 
      '&access_token=' + FBConfig.appId + '|' + FBConfig.appSecret;

    console.log('\x1B[32m[graphapi]\x1B[0m Grabbing test access token from facebook');

    // Get Access token before continuing with tests
    graph.get(encodeURI(testUserUrl), function (err, res) {

      // Might fail due to facebook's awesomeness
      // ========================================
      if (res.error && 
        res.error.message.indexOf('Service temporarily unavailable')) {

        console.error("Can't retreive access token from facebook\n" + 
              "Try again in a few minutes");
        console.log(res.error);
        process.exit(1);
      }

      test.ok(includesKeys(['id','access_token','login_url','email','password'], res));

      graph.setAccessToken(res.access_token);
      test.done();
    });
  },

  'should be able to grab data using an access token': function (test) {
    test.expect(1);

    graph.get('/817129783203', function (err, res) {
      test.equal('817129783203', res.id, 'response id should be valid');
      test.done();
    });
  },

  'users should have proper permissions': function (test) {
    test.expect(2);

    graph.get('/me/permissions', function (err, res) {
      var permissions = FBConfig.scope
                                .replace(/ /g,'')
                                .split(',');

      permissions.push('installed');

      test.ok(Array.isArray(res.data), 'response data should be an array');
      test.ok(includesKeys(permissions, res.data[0]));
      test.done();
    });
  },

  'should perform a public search': function (test) {
    test.expect(2);

    graph.search({ q: 'watermelon', type: 'post' }, function (err, res) {
      test.ok(Array.isArray(res.data), 'response data should be an array');
      test.ok(res.data.length > 1, 'response data should not be empty');
      test.done();
    });
  },

  'should perform an access token required search': function (test) {
    test.expect(2);

    var searchOptions = {
        q:       'coffee'
      , type:    'place'
      , center:  '37.76,-122.427'
      , distance: 1000
    };
    graph.search(searchOptions, function (err, res) {
      test.ok(Array.isArray(res.data), 'response data should be an array');
      test.ok(res.data.length > 1, 'response data should not be empty');
      test.done();
    });
  }

};
