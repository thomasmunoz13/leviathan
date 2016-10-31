var nconf = require('nconf');
var server = require('./server/server');

nconf.use("file", {file : "./config.json"});
nconf.load();

var name = nconf.get('name');

server.launch(nconf);