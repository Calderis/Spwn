var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

var mongoUri = 'mongodb://localhost/noderest';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function () {
	throw new Error('unable to connect to database at ' + mongoUri);
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000)

<§- data -> model -§>
require('./app/models/<§ model.plurialName §>');
<-§->

require('./app/routes')(app);

var server = http.createServer(app)
server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'))
})