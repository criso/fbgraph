
/**
 * Module dependencies.
 */

var express   = require('express')
  , app       = module.exports = express.createServer()
  , everyauth = require('everyauth')
  , Promise       = everyauth.Promise
  , graph     = require('./lib/graph')
  , oauthconf = require('./lib/config');



// User authentication
// ===================
everyauth
  .facebook
    .appId(oauthconf.facebook.appId)
    .appSecret(oauthconf.facebook.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
    })
    .scope(oauthconf.facebook.scope)
    .moduleErrback( function (err) {
      console.log("error: ", err);
    })
    .redirectPath('/');


// Configuration
// ==============
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'houdinified ville'}));

  app.use(everyauth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});



// Routes

app.get('/', function(req, res){
  res.render('index', { title: 'Express' });
});




everyauth.helpExpress(app);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
