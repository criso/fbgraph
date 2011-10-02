# Facebook Graph API

Geting data from the graph api

## About

  I created this, because I wanted to access FB's graph from `node`. The libraries I found felt clunky to me, and I needed an excuse to create a node module.

## Oh nooooooesss
  This library doesn't provide any facebook authentication.
  Usually authentication happens in lots of flavours `facebook`, `twitter`, `your own!`, and this problem has already been solved by a variety of modules such as `everyauth`or `connect-auth`

  Before making calls that require an `access token` be sure to set the token

## Installation
    $ npm install fbgraph
    
    var graph = require('fbgraph');
    

## Setting an access token
```js
graph.setAccessToken(accessToken);
```

## Reading data from the Graph Api

```js
graph.get("zuck", function(err, res) {
  console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
});
```

`params` in the url

```js
graph.get("zuck?fields=picture", function(err, res) {
  console.log(res); // { picture: 'http://profile.ak.fbcdn.net/'... }
});
```

`params` as an object

```js
var params = { fields: picture };
graph.get("zuck", params,  function(err, res) {
  console.log(res); // { picture: "http://profile.ak.fbcdn.net/..." }
});
```

GraphApi calls that redirect directly to an image
will return a json response with relevant fields

```js
graph.get("/zuck/picture", function(err, res) {
  console.log(res); // { image: true, location: "http://profile.ak.fb..." }
});
```

## Searching data

Search for public posts that contain __brogramming__

```js
var searchOptions = {
    q: "brogramming"
  , type: "post"
};

graph.search(searchOptions, function(err, res) {
  console.log(res); // {data: [{id: xxx, from: ...}, {id: xxx, from: ...}]}
});
```

## Publishing data to the Graph Api
All publish requests will require an `access token`

only needs to be set once

```js
graph.setAccessToken(accessToken);
```

Post a message on a `friend's` wall

```js
var wallPost = {
  message: "I'm gonna come at you like a spider monkey, chip!"
};

graph.post(userId + "/feed", wallPost, function(err, res) {
  // returns the post id
  console.log(res); // { id: xxxxx}
});
```

## Delete a Graph object

To delete a graph object, provide an `object id` and the 
response will return `true` or `false`

```js
graph.del(postID, function(err, res) {
  console.log(res); // true/false
});
```


## Running tests

 Add your Facebook `appId` and `appSecret` to tests/config.js (this is needed to create `test users` and to get a test `access_token`)

    $ make test

 _Tests might fail due to the Facebook api having an issue._

## License

(The MIT License)

Copyright (c) 2011 Cristiano Oliveira &lt;ocean.cris@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

