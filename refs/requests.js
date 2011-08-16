var https = require('https');

var options = {
  host: 'graph.facebook.com',
  path: '/btaylor',
};

https.get(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));

  var body = '';
  res.on('data', function(chunk) {
    body += chunk; 
  });

  res.on('end', function() {
    console.log(body); 
  });

});

// ====================================================================
// Make Request
connection = http.createClient(options.port, options.host);
var request = connection.request("GET", options.path);

// Handle Response
request.addListener("response", function (response) {
    var responseBody = "";  
    response.addListener("data", function(chunk) {
        responseBody += chunk;
    });
    response.addListener("end", function() {
        geocoder.responseHandler(responseBody, callback);
    });
});

// ====================================================================
// Https

var https = require('https');

https.get({ host: 'encrypted.google.com', path: '/' }, function(res) {
  console.log("statusCode: ", res.statusCode);
  console.log("headers: ", res.headers);

  res.on('data', function(d) {
    process.stdout.write(d);
  });

}).on('error', function(e) {
  console.error(e);
});


