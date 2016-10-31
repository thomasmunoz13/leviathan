var client = require('../client/sync');
var main = require('./main');
var keypress = require('keypress');

var nodes = [];
var currentNode = {};

exports.start = function(conf){
    if(checkConf(conf)){
        initNodes(conf);
        if(needFirstSync(conf)){
            client.sync(conf.get('reach'), currentNode, (newNodes) => {
                newNodes.forEach((elem) => nodes.push(elem));
                launch(conf);
            });
        } else {
            launch(conf);
        }

    } else {
        console.error("Missing port property in config file, abort ...");
    }
};

/**
 * Check is the current node need to sync with other node
 * (it is not alone in the cluster)
 * @param conf
 * @returns {boolean}
 */
var needFirstSync = function(conf){
  return !conf.get('first') && conf.get('reach') !== undefined;
};

var checkConf = function(conf){
    return conf.get('port') !== undefined;
};

var initNodes = function(conf){
    currentNode = {
        'name' : conf.get('name'),
        'ip' : conf.get('ip'),
        'role' : conf.get('role'),
        'status' : 'ready'
    };
};

var isMaster = function(conf){
    return conf.get('role') === 'master';
};

var launch = function(conf){
    handleKey();

    console.log(currentNode.name + " is serving on " + currentNode.ip);
    console.log("Press \"q\" or CTRL+C to quit, press \"l\" to list nodes");
    main.start(nodes, currentNode, conf.get("key"), conf);

};

function save(){
    console.log("Exiting application and deleting nodes ...");
    client.logout(nodes, currentNode);
}

function listingNodes(){
    console.log("Nodes available");
    console.log(nodes);
    console.log('');
}

function handleKey(){
    keypress(process.stdin);

    process.stdin.on('keypress', function (ch, key) {
        if (key && key.name == 'q') {
            save();
        } else if (key && key.ctrl && key.name == 'c'){
            process.exit();
        } else if (key && key.name == 'l'){
            listingNodes();
        }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
}
