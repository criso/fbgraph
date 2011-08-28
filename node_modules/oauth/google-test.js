//var OAuth= require('./lib/oauth').OAuth;
var sys= require('sys');
var OAuth= require('./lib/oauth').OAuth;

oa= new OAuth("https://www.google.com/accounts/OAuthGetRequestToken",
                 "https://www.google.com/accounts/OAuthAuthorizeToken", 
                 "anonymous",  "anonymous", 
                 "1.0A", "http://localhost:3000/oauth/callback", "HMAC-SHA1");       

oa.getOAuthRequestToken({"scope":"http://www.google.com/calendar/feeds"},function(error, oauth_token, oauth_token_secret, results){
 if(error) sys.puts('error :' + JSON.stringify(error))
 else { 
   sys.puts('oauth_token: ' + oauth_token)
   sys.puts('oauth_token_secret: ' + oauth_token_secret)
   sys.puts('requestoken results: ' + sys.inspect(results))
   sys.puts("Requesting access token")
/*   oa.getOAuthAccessToken(oauth_token, oauth_token_secret, 'verifier', function(error, oauth_access_token, oauth_access_token_secret, results2) {
     sys.puts('oauth_access_token: ' + oauth_access_token)
     sys.puts('oauth_token_secret: ' + oauth_access_token_secret)
     sys.puts('accesstoken results: ' + sys.inspect(results2))
     sys.puts("Requesting secure schznit")
     var data= "";
     oa.getProtectedResource("http://localhost:3000/fetch/unicorns?foo=bar&too=roo", "GET", oauth_access_token, oauth_access_token_secret,  function (error, data, response) {
       sys.puts(sys.inspect(error));
       sys.puts(data);
     });
   }); */
 }
})   