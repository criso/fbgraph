#================================================
Pri
=================================================
  - Just use everyauth to connect *for now*
  - Focus on the GET api first, since POSTS will 
    probably be done via the JS SDK
    
//------------------------------------------------




put facebook credentials on a readable only file
=================================================
* Configuration. This file is read only
*  https://gist.github.com/1139159
module.exports = Object.freeze({
  pewpew: "moo"
});


Should work like 
================
- php sdk
    http://developers.facebook.com/docs/authentication/
    https://github.com/facebook/php-sdk/blob/master/examples/example.php
- ruby sdk
    https://github.com/mmangino/facebooker2 

Setup
=====
- configuration file
  function('developlment', function() {})
  function('production', function() {})
  function('test', function() {})

- use everyauth for authentication (don't reinvent that part) - **focus** on the api

_ output the login and redirect url_
= fbLoginAndRedirect('http://mysite.com', permsObject)



#=======================================================================
https://github.com/facebook/php-sdk/blob/master/src/base_facebook.php

Look at:
  protected function graph($path, $method = 'GET', $params = array()) {

     $result = json_decode($this->_oauthRequest(
      $this->getUrl('graph', $path),
      $params
    ), true);
 
  protected function oauthRequest($url, $params) {

#=======================================================================

Should allow settings for 
===========================
app.configure('development', function () {
    app_id: <your application id>
  , secret: <your application secret>
  , api_key: <your application key>  
});

app.configure('production', function () {
    app_id: <your application id>
  , secret: <your application secret>
  , api_key: <your application key>  
});

var user = FB.getUser();
var user_profile = FB.api('/me', function(resp) {
});
_


# access_token should be included automatically

    facebook
      .get('/me/friends')
      .end(function (res) {
        if (res.ok) {}
      });

# two ways

    facebook.post('/me/feed').end(function(res){});
    facebook.post('/me/feed', function(res){});

    facebook
      .post('/me/feed')
      .data({
        message:      'message here'
        name:         'name and stuff' 
        description:  'description goes here'
        caption:      'www.sniqueaway.com',
        picture:      'picture goes here'
        link:         'http://www.link.com'
        actions:      {
            name:   'Join Now',
            link:   'http://www.link.com'
        }
      })
      .end(function (res) {
        if (res.ok) {
          console.log('worked'); 
        } else {
          console.log('did not work'); 
        }
      });


#-------------------------
# API Calls
#-------------------------

 Users: https://graph.facebook.com/btaylor (Bret Taylor)
 Pages: https://graph.facebook.com/cocacola (Coca-Cola page)
 Events: https://graph.facebook.com/251906384206 (Facebook Developer Garage Austin)
 Groups: https://graph.facebook.com/195466193802264 (Facebook Developers group)
 Applications: https://graph.facebook.com/2439131959 (the Graffiti app)
 Status messages: https://graph.facebook.com/367501354973 (A status message from Bret)
 Photos: https://graph.facebook.com/98423808305 (A photo from the Coca-Cola page)
 Photo albums: https://graph.facebook.com/99394368305 (Coca-Cola's wall photos)
 Profile pictures: http://graph.facebook.com/ocean.cris/picture (your profile picture)
 Videos: https://graph.facebook.com/817129783203 (A Facebook tech talk on Graph API)
 Notes: https://graph.facebook.com/122788341354 (Note announcing Facebook for iPhone 3.0)
 Checkins: https://graph.facebook.com/414866888308 (Check-in at a pizzeria)





