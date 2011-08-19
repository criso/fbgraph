var graph  = require('graph')
  , assert = require('assert')
  , should = require('should')
  , FBConfig = require('config').facebook;


module.exports = {

  'should have the correct graph url': function () {
    graph.should.have.property('graphUrl', 'graph.facebook.com');
  },

  'test retrieving data from the api': function () {
    graph.get('/btaylor', function(err, res) {
      res.should.include.keys('username', 'name', 'first_name', 'last_name');
    });
  },

  'test bad facebook url should return error': function () {
    graph.get('/thisUserNameShouldNotExist', function(err, res) {
      res.should.include.keys('error');
    });
  },

  'should throw and error for parsing invalid json': function () {
    // graph.graphUrl = '###';
    graph.get('', function(err, res) {
      assert.equal(err.error, 'Error parsing json', 
        'Should throw an error while parsing json');
    });
  },

  'should return an error for invalid url': function () {
    var url        = graph.graphUrl;
    graph.graphUrl = '###';

    graph.get('', function(err, res) {
      assert.equal(err.error, 'Error processing https request', 
        'Should return an error processing the https request');
    });

    graph.graphUrl = url;
  },

  'should return an error if api url is not a string': function () {
    graph.get({you: 'shall not pass'}, function(err, res) {
      assert.equal(err.error, 'Graph api url must be a string',
        'Should return an error if api url is not a string');
    });

  },

  'test image redirect': function () {
    graph.get('/markzuckerberg/picture', function(err, res) {
      res.should.include.keys('image', 'location');  
    });
  },

  'test image redirect with missing slash': function () {
    graph.get('markzuckerberg/picture', function(err, res) {
      res.should.include.keys('image', 'location');  
    });
  },

  'graph urls that require a token should return an error': function () {
      graph.get('/817129783203', function (err, res) {
        res.should.include.keys('error');
        assert.equal(res.error.type, 'OAuthException',
        'Response from facebook should be an OAuthException');
      });
  },

  // Async tests that require an Acess Token
  // =================================

  'Access token tests': function (beforeExit) {

    var asyncTestCount  = 0
      , expectedTests   = 5
      , url             = '';

    var testUserUrl = '/' + FBConfig.appId + '/accounts/test-users?' + 
      'installed=true' + 
      '&name=Ricky Bobby' +
      '&permissions=' + FBConfig.scope +
      '&method=post' + 
      '&access_token=' + FBConfig.appId + '|' + FBConfig.appSecret;

    console.log('Please hold... Grabbing an access token from Facebook');
    
    // Get Access token before continuing with tests
    graph.get(encodeURI(testUserUrl), function (err, res) {
      asyncTestCount++;

      // Test: valid access_token response
      // Might fail due to facebook's awesomeness 
      // ========================================================
      if (res.error) {
        if (res.error.message.indexOf('Service temporarily unavailable')) {
          console.error("Can't retreive access token from facebook\n" + 
                        "Try again in a few minutes");
          console.log(res.error);
          process.exit(1);
        }
      }

      res.should.include.keys('id', 'access_token', 'login_url', 'email','password');
      
      graph.setAccessToken(res.access_token);

      // Test: should be able to grab data using an access token
      // ========================================================
      url = '/817129783203';
      graph.get(url, function (err, res) {
        assert.equal('817129783203', res.id, 'response id should be valid');
        asyncTestCount++;
      });

      // Test: Test users should have proper permissions
      // ===============================================
      url = '/me/permissions';
      graph.get(url, function (err, res) {
        var permissions = FBConfig.scope
                                  .replace(/ /g,'')
                                  .split(',');

        permissions.push('installed');

        assert.ok(Array.isArray(res.data), 'response data should be an array');
        res.data[0].should.include.keys(permissions);

        asyncTestCount++;
      });

      // Test: Perform a public search
      // ======================
      var searchOptions = { q: 'watermelon' , type: 'post' };
      graph.search(searchOptions, function (err, res) {
        assert.ok(Array.isArray(res.data), 'response data should be an array');
        assert.ok(res.data.length > 1, 'response data should not be empty');

        asyncTestCount++;
      });

      // Test: Perform a access token required search
      // ============================================
      searchOptions = { 
          q:         'coffee'
        , type:      'place'
        , center:    '37.76,-122.427'
        , distance:  1000
      };
      graph.search(searchOptions, function (err, res) {
        assert.ok(Array.isArray(res.data), 'response data should be an array');
        assert.ok(res.data.length > 1, 'response data should not be empty');

        asyncTestCount++;
      });

    });

    // Make sure we've run all async tests before existing
    beforeExit(function(){
      assert.equal(expectedTests, asyncTestCount, 
                  'All async tests should be executed');
    });

  }
};
