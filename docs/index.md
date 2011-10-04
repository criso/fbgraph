# Bro, It's the Faceobok Graph !

[FBgraph](http://github.com/criso/fbgraph) is a nodejs module that provides easy access to the facebook graph api

## About

  I created this, because I wanted to access FB's graph from `node`.  
  The libraries I found felt clunky to me, and I needed an excuse to create a node module.

## Oh nooooooesss

  This library __doesn't__ provide any __facebook authentication__.
  
  Usually authentication happens in lots of flavours `facebook`, `twitter`, `your own!`.  
  Since this problem has already been solved by a variety of modules such as `everyauth`or `connect-auth`    
  I decided not to account for it here.


## Installation via npm
    $ npm install fbgraph  
    
    var graph = require('fbgraph');
    
## Setting an access token

Before making calls that require an `access token` be sure to set the token

    graph.setAccessToken(accessToken);

## Read data from the Graph Api

    graph.get("zuck", function(err, res) {
      console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
    });

params in the `url`

    graph.get("zuck?fields=picture", function(err, res) {
      console.log(res); // { picture: 'http://profile.ak.fbcdn.net/'... }
    });

params as an `object`

    var params = { fields: picture };

    graph.get("zuck", params,  function(err, res) {
      console.log(res); // { picture: "http://profile.ak.fbcdn.net/..." }
    });

GraphApi calls that redirect directly to an image
will return a json response with relevant fields


    graph.get("/zuck/picture", function(err, res) {
      console.log(res); // { image: true, location: "http://profile.ak.fb..." }
    });


## Search data from the Graph Api

Search for public posts that contain __brogramming__

    var searchOptions = {
        q:     "brogramming"
      , type:  "post"
    };

    graph.search(searchOptions, function(err, res) {
      console.log(res); // {data: [{id: xxx, from: ...}, {id: xxx, from: ...}]}
    });


## Publish data to the Graph Api
All publish requests will require an `access token`

only needs to be set once

    graph.setAccessToken(accessToken);

Post a message on a `friend's` wall

    var wallPost = {
      message: "I'm gonna come at you like a spider monkey, chip!"
    };

    graph.post(userId + "/feed", wallPost, function(err, res) {
      // returns the post id
      console.log(res); // { id: xxxxx}
    });

## Delete a Graph object

To delete a graph object, provide an `object id` and the 
response will return `true` or `false`

    graph.del(postID, function(err, res) {
      console.log(res); // true/false
    });

## Running tests

 Add your Facebook `appId` and `appSecret` to __tests/config.js__   
(this is needed to create `test users` and to get a test `access_token`)

    $ npm install && npm test

 _Tests might fail if the Facebook api has an issue._

