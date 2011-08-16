var graph  = require('graph')
  , assert = require('assert')
  , should = require('should');


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

  'should throw error for invalid url': function () {
    var url        = graph.graphUrl;
    graph.graphUrl = '###';

    graph.get('', function(err, res) {
      assert.equal(err.error, 'Error processing https request', 
        'Should throw an error processing the https request');
    });

    graph.graphUrl = url;
  },

  'test image redirect': function () {
    graph.get('/ocean.cris/picture', function(err, res) {
      res.should.include.keys('image', 'location');  
    });
  }

};
