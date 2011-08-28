//var OAuth= require('./lib/oauth').OAuth;
var sys= require('sys');
var OAuth= require('./lib/oauth').OAuth;

oa= new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 "RuN9ovM7vvXyOO1N6DmhsA",  "qpUPDJJasO5G2jZenK3m7t7pAcA9ZuyUv8WsGnonJo", 
                 "1.0A", "http://localhost:3000/oauth/callback", "HMAC-SHA1");       

var access_token= '23186482-CpF7lxJx1T2GhJ8fQT3ewvuIpbMtskHcN6craOzly';
var access_token_secret= '8SqTfcI7uW7lwcBQnnpEsvY59u788s8TS2OmX1AGpKU';

/*var request= oa.get("http://stream.twitter.com/1/statuses/filter.json?follow=11528912,9512582", access_token, access_token_secret );
request.addListener('response', function (response) {
  response.setEncoding('utf8');
  response.addListener('data', function (chunk) {
    console.log(chunk);
  });
  response.addListener('end', function () {
    console.log('--- END ---')
  });
});

request.end();
*/
/*
oa.get("http://api.twitter.com/1/statuses/retweeted_by_me.json", access_token, access_token_secret, function(error, data) {
  console.log(sys.inspect(data));
});*/

oa.post("http://api.twitter.com/1/statuses/update.json", access_token, access_token_secret,
           {"status":"Just testing one of my OAuth libs for compatability issues, sorry!"}, function(e,d){
  console.log(sys.inspect(e));
  console.log(sys.inspect(d));
});