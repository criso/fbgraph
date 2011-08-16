var express = require('express')
  , fb = require('facebook-js')
  , app = express.createServer(
      express.bodyParser()
    , express.cookieParser()
    , express.session({ secret: 'some secret' })
    );

app.get('/', function (req, res) {
  res.redirect(fb.getAuthorizeUrl({
    client_id: 'appID',
    redirect_uri: 'http://yourhost.com:3003/auth',
    scope: 'offline_access,publish_stream'
  }));
});

app.get('/auth', function (req, res) {
  fb.getAccessToken('appID', 'appSecret', req.param('code'), 'http://yourhost.com:3003/auth', function (error, access_token, refresh_token) {
    res.render('client', {access_token: access_token, refresh_token: refresh_token});
  });
});

app.post('/message', function (req, res) {
  fb.apiCall('POST', '/me/feed',
    {access_token: req.param('access_token'), message: req.param('message')},
    function (error, response, body) {
      res.render('done', {body: body});
    }
  );
});

app.get('/messages', function (req, res) {
  var stream = fb.apiCall('GET', '/me/feed', {access_token: req.param('access_token'), message: req.param('message')});
  stream.pipe(fs.createWriteStream('backup_feed.txt'));
});

app.listen(3000);
