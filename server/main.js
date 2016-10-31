const spawn = require('child_process').spawn;
var client = require('../client/sync');

var statuses = {
    ready: "Ready",
    deploying : "Deploying"
};

var status = statuses.ready;

exports.start = function(nodes, currentNode, apiKey, conf){
    var mainIO = require('socket.io')(conf.get('port'));

    mainIO.on('connection', (socket) => {
        socket.on('node:get', () => {
            // Workaround to pass nodes array by value #Tru3Hack3r
            var toReturn = nodes.slice();
            toReturn.push(currentNode);

            socket.emit('node:get', toReturn);
        });

        socket.on('node:add', (toAdd) => {
            console.log("Adding new node");
            console.log(toAdd);
            console.log('');
            nodes.push(toAdd);
            propagate();
        });

        socket.on('deploy', () => {
            if(conf.get('role') === 'master'){
                client.deploy(nodes, (output) => socket.emit('deploy:result', output));
            } else if(status == statuses.ready){
                status = statuses.deploying;

                var cmd = spawn("./" + conf.get('script'));

                var stdout = '';
                cmd.stdout.on('data', (data) => {
                  stdout += data;
                  socket.emit("deploy:result", {
                    'name': currentNode.name,
                    'stdout': stdout,
                    'stderr': stderr
                  });
                });

                var stderr = '';
                cmd.stderr.on('data', (data) => {
                  stderr += data;
                  socket.emit("deploy:result", {
                    'name': currentNode.name,
                    'stdout': stdout,
                    'stderr': stderr
                  });
                });

                //socket.emit("deploy:result", output);
                status = statuses.ready;
            }
        });

        socket.on('node:delete', (toRemove) => {
            let index = -1;

            for(let i = 0; i < nodes.length; ++i){
                if(nodes[i].name === toRemove.name
                    && nodes[i].ip === toRemove.ip
                    && nodes[i].role === toRemove.role){
                    index = i;
                    break;
                }
            }

            nodes.splice(index, 1);

            propagate();
        });

        socket.on('status:get', () => {
            socket.emit('status:get', status);
        });

        var propagate = function(){
          // Workaround to pass nodes array by value #Tru3Hack3r
          var toReturn = nodes.slice();
          toReturn.push(currentNode);

          socket.broadcast.emit('node:get', toReturn);
        };
    });

};
