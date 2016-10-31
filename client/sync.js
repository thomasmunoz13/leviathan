var ioc = require('socket.io-client');

exports.sync = function(toReach, currentNode, callback){
    console.log("Connecting to " + toReach);
    var client = ioc.connect(toReach);

    client.once('connect', () => {
        client.emit('node:get');
        
        client.on('node:get', (nodes) => {
            nodes.forEach((elem) => {
                notifyNewNode(elem, currentNode);
            });

            callback(nodes);
            client.disconnect();
        });
    });
};

var notifyNewNode = function(node, newNode){
    let client = ioc.connect(node.ip);
    client.once('connect', () => {
        client.emit('node:add', newNode);
        client.disconnect();
    });
};

exports.deploy = function(nodes, callback){
  nodes.forEach((elem) => {
     if(elem.role === 'slave'){
         let client = ioc.connect(elem.ip);

         client.once('connect', () => {
             client.emit('deploy');

             client.on('deploy:result', (output) => {
                 let result = {
                     'node': elem,
                     'output': output
                 };

                 callback(result);
             });
         });
     }
  });
};

exports.logout = function(nodes, currentNode){
    console.log("Logging out ...");

    nodes.forEach((elem) => {
        let client = ioc.connect(elem.ip);

        client.once('connect', () => {
            client.emit('node:delete', currentNode);
            client.disconnect();
        });
    });

    console.log("Logged out");
};