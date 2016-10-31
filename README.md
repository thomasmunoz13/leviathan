# Documentation

## Config
The server node config is in *config.json*
In order to make this work, every cluster must live under the same network (identified by the apiKey), 
if it's the first node, the application will give you one.

The config.json file looks like that

```json
{
  "port" : 0000, 
  "ip" : "http://your_ip:port", 
  "role" : "slave", 
  "name" : "Simba", 
  "first" : true,
  "key" : "xxxxxxxxxx[...]", 
  "script" : "helloworld.sh", 
  "reach" : "http://node_ip:port"
}
```

#### Details 
- **port** : Port in which the node will be listening
- **ip** : IP Address of the node (this IP will be send to other nodes, so make sure it's accessible)
- **role** : *slave*/*master* 
    - **slave** is a node that can deploy (i.e execute a script/program)
    - **master** is a node that can send the deploy command to other nodes (you cannot deploy with a master node) 
- **name** : the name of the node  
- **first** : determine if it's the first node or not (in order to determine if this new node will try to integrate an existing network)
- **key** : a key that identify the network (if not provided, the application will give you one for the first node)
- **script** : the command to run on deploy command
- **reach** : when it's not the first node, you specify a running node IP and this node will access the cluster from the provided node

#### Example 
We want to run a deploying node for the deploy.sh script at 127.0.0.1:8000 and a master node in 127.0.0.1:8001 (both on the same PC, but it's the same if not)

##### First node (deploying node)

```json
{
    "port" : 8000, 
    "ip" : "http://127.0.0.1:8000",
    "role" : "slave", 
    "name" : "Simba", 
    "first" : true, 
    "key" : "CLRaO1kAoknEGLe8xgUvBMA1aGRLt5O6t0QHJErB5IlZIHcntCW3xA5nUIWm3EiH", 
    "script" : "deploy.sh"
}
```

##### Second node (master node)

```json
{
    "port" : 8001, 
    "ip" : "http://127.0.0.1:8001",
    "role" : "master", 
    "name" : "Mufasa", 
    "first" : false,
    "reach" : "http://127.0.0.1:8000",
    "key" : "CLRaO1kAoknEGLe8xgUvBMA1aGRLt5O6t0QHJErB5IlZIHcntCW3xA5nUIWm3EiH"
}
```

##### Setting up
Make sure you run the first node first (otherwise the second node will not be set up), and you're good !
