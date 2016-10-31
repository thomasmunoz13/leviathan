var rand = require("generate-key");
var server = require("./actions");

var nconf;

exports.launch = function(conf){
    nconf = conf;
    
    if(checkNeedGenerate()){
        console.log('API Key : ' + generateCredentials());
    } else if(checkCredentials()){
        console.error('No api key specified. Abort ...');
    } else {
        console.log('Server starting');
        server.start(nconf);
    }
};

var checkCredentials = function(){
    return nconf.get('key') === undefined;
};

var checkNeedGenerate = function(){
   return checkCredentials() && nconf.get('first');
};

var generateCredentials = function(){
    return rand.generateKey(64);
};