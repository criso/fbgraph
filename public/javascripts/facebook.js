var App = window.App || {};

App.Facebook = ({

  appPerms: [
    'email',
    'user_about_me',
    'user_birthday',
    'user_location', 
    'publish_stream', 
    'friends_location'
  ],

  FBUser:     {},
  FBFriends:  {},

  loadFB: function () {
    var self = this
      , fbID = '193097990710217';

    window.fbAsyncInit = function() {
      FB.init({
        appId:  fbID,
        status: true,
        cookie: true,
        xfbml:  false 
      });
    };

    (function() {
      var e = document.createElement('script');
      e.async = true;
      e.src = document.location.protocol+'//connect.facebook.net/en_US/all.js';
      document.getElementById('fb-root').appendChild(e);
    }());   

    return this;
  }


}).loadFB();

