var  http = require('http')
   , OAuth= require('./index').OAuth
   , url = require('url')
   , consumerKey= "RuN9ovM7vvXyOO1N6DmhsA"
   , consumerSecret= "qpUPDJJasO5G2jZenK3m7t7pAcA9ZuyUv8WsGnonJo";

var oAuth= new OAuth("http://twitter.com/oauth/request_token",
                        "http://twitter.com/oauth/access_token", 
                        consumerKey,  consumerSecret, 
                        "1.0a", "http://redirect_callback_url.com", "HMAC-SHA1");

http.createServer(function (req, res) {
   var urlp= url.parse(req.url, true);
   if( urlp.query && urlp.query.oauth_verifier ) {
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end('Verification callback: ' + urlp.query.oauth_verifier +'\n');
   }
   else { 
     oAuth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, oauth_authorize_url, additionalParameters ) {
       console.log( error );
       res.writeHead(301, {
         'Location': "http://twitter.com/oauth/authenticate?oauth_token=" + oauth_token
       });
       res.end();
     });
   }
}).listen(80, "127.0.0.1");
