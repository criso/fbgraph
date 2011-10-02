// Facebook app config for tests
module.exports = {
  facebook: {
    appId:      'Your facebook app id',
    appSecret:  'Your facebook app secret',
    scope:      'email, user_about_me, user_birthday, user_location, publish_stream, read_stream, friends_location',
    callback:   'http://localhost:3000/auth/facebook'
  }
};
