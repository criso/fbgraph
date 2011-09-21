var graph      = require('../lib/graph')
	, FBConfig = require('../lib/config').facebook
	, vows     = require('vows')
	, events   = require('events')
	, assert   = require('assert');



// Create test suite
vows.describe('Graph Api').addBatch({
    'GraphApi': {

        'setting': {
            topic: graph,

            'graphUrl should be graph.facebook.com': function (graph) {
                assert.ok(graph.getGraphUrl() === 'graph.facebook.com');
            }
        },

        'tests that do *not* require an access token ': {
            'when getting by username': {
                // topic: graph,   
                topic: function() { graph.get('/btaylor', this.callback) },

                'should get public data': function (err, res) {
                    assert.include(res, 'username');
                    assert.include(res, 'name');
                    assert.include(res, 'first_name');
                    assert.include(res, 'last_name');
                }
            },

            'when requesting an url for a user that does not exist': {
                topic: function () { graph.get('/thisUserNameShouldNotExist', this.callback) },

                'should return an error': function (err, res) {
                    assert.include(res, 'error');
                }
            },

            'when using an empty api url': {
                topic: function() { graph.get('', this.callback) },

                'should throw and error for parsing invalid json': function (err, res) {
                    assert.equal(err.error, 'Error parsing json',
                    'Should throw an error while parsing json');
                }
            },

            'when not using a string as an api url': {
                topic: function () { graph.get({ you: 'shall not pass' }, this.callback) },

                'should return an api must be a string error': function (err, res) {
                    assert.equal(err.error, 'Graph api url must be a string',
                    'Should return an error if api url is not a string');
                }
            },

            'when requesting a public profile picture': {
                topic: function () { graph.get('/zuck/picture', this.callback) },

                'should get an image and return a json with its location ': function (err, res) {
                    assert.include(res, 'image');
                    assert.include(res, 'location');
                }
            },

            'when requesting an api url with a missing slash': {
                topic: function () { graph.get('zuck/picture', this.callback) },

                'should be able to get valid data': function (err, res) {
                    assert.include(res, 'image');
                    assert.include(res, 'location');
                }
            },

            'when trying to access data that requires an access token': {
                topic: function () { graph.get('/817129783203', this.callback) },

                'should return an OAuthException error': function (err, res) {
                    assert.include(res, 'error');
                    assert.equal(res.error.type, 'OAuthException',
                      'Response from facebook should be an OAuthException');
                }
            },

            'when performing a public search ': {
                topic: function () { graph.search({ q: 'watermelon', type: 'post' }, this.callback) },

                'should return valid data': function (err, res) {
                    assert.ok(Array.isArray(res.data), 'response data should be an array');
                    assert.ok(res.data.length > 1, 'response data should not be empty');
                }
            },

        },

        'tests that *require* an access token': {

            'after getting a valid token': {
                topic: function () {

                    var testUserUrl = '/' + FBConfig.appId + '/accounts/test-users?' + 
                    'installed=true' + 
                    '&name=Ricky Bobby' +
                    '&permissions=' + FBConfig.scope +
                    '&method=post' + 
                    '&access_token=' + FBConfig.appId + '|' + FBConfig.appSecret;

                    var promise = new events.EventEmitter();

                    graph.get(encodeURI(testUserUrl), function(err, res) {
                        if (!res || res.error
                            && res.error.message.indexOf('Service temporarily unavailable')) {

                            promise.emit('error', err); 
                            console.error("Can't retreive access token from facebook\n" + 
                            "Try again in a few minutes");
                        } else {
                            graph.setAccessToken(res.access_token);
                            promise.emit('success', res); 
                        }
                    });

                    return promise;
                },

                'should have valid keys': function(err, res) {
                    assert.include(res, 'id');
                    assert.include(res, 'access_token');
                    assert.include(res, 'login_url');
                    assert.include(res, 'email');
                    assert.include(res, 'password');
                },

                'when getting data from a protected page': {
                    topic: function () { graph.get('/817129783203', this.callback) },

                    'response should be valid': function(err, res) {
                        assert.equal('817129783203', res.id, 'response id should be valid');
                    }
                },

                'when getting a user permissions': {
                    topic: function () { graph.get('/me/permissions', this.callback) },

                    'test user should have proper permissions': function (err, res) {
                        var permissions = FBConfig.scope
                                                .replace(/ /g,'')
                                                .split(',');

                        permissions.push('installed');

                        permissions.forEach(function(key) {
                            assert.include(res.data[0], key);
                        });
                    }
                },

                'when performing a search': {
                    topic: function () { 
                        var searchOptions = {
                              q:       'coffee'
                            , type:    'place'
                            , center:  '37.76,-122.427'
                            , distance: 1000
                        };

                        graph.search(searchOptions, this.callback);
                    }, 

                    'an access token required search should return valid data': function (err, res) {
                        assert.ok(res.data.length > 1, 'response data should not be empty');
                    }
                }
            }
        }
    }
}).export(module);
