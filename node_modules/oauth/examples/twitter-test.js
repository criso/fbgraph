var sys= require('sys');
var OAuth= require('../lib/oauth').OAuth;
oa= new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 "JiYmll7CX3AXDgasnnIDeg", "mWPBRK5kG2Tkthuf5zRV1jYWOEwnjI6xs3QVRqOOg", 
                 "1.0A", "http://localhost:3000/oauth/callback", "HMAC-SHA1");

var delim = /\n*\r\n*/;
var buffer= "";

//var filterString= require('querystring').escape(process.argv[2]); 
var filterString= require('querystring').escape("social or network"); 
var request= oa.post("http://stream.twitter.com/1/statuses/filter.json?track="+ filterString, 
        "23186482-ZXEosOnO34TIzAAMEVMilrXcHezMF4odlDwvKNyA", 
        "PnNN2GWYlfNCyhN6dAiMLQdvvDLy67dpaALies");
request.addListener('response', function (response) {
  response.setEncoding('utf8');
  response.addListener('data', function (chunk) {
    buffer += chunk;
    var parts= buffer.split(delim);
    var len = parts.length;
    if( len >1 ) {
      buffer = parts[len-1];
      for(var i=0, end = len -1; i< end; ++i) {
        var entry = parts[i];
        if( entry !== "" ) { 
          var obj= JSON.parse(entry);
          console.log("@"+ obj.user.screen_name +" says " + obj.text);
        }
      }
    }
  });
});
request.end();