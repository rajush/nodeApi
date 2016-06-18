// request allows to make http calls to secondary servers.
// aggregator server that connects to all other servers
var r = require('request').defaults({
    json: true // returning data
});

var async = require('async');
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1'); //attaching to a client in a localhost (could be in the cloud)

module.exports = function(app){

    // Read
    app.get('/pets', function(req, res){

        // using async to call 'request'
        // this could hae as many callback functions running parallel
        async.parallel({
            cat: function(callback){
                r({url: 'http://localhost:3000/cat'}, function(error, response, body){
                    if (error) {
                        callback({service: 'cat', error: error});
                        return;
                    }
                    if(!error && response.statusCode === 200){
                        callback(null, body.data);
                    }else{
                        callback(response.statusCode);
                    }
                });
            },
            dog: function(callback){
                /* using 'async' to talk to 'redis' first */
                /* check in the 'redis' first, if the "key/url" already exists
                /* meaning: if the end point was called before, return the same data */
                client.get('http://localhost:3001/dog', function(error, dog){
                    if (error) {
                        throw error;
                    }
                    // exist (already been cached)
                    if (dog) {
                        // parsing the JSON string value to JSON object before sending back
                        callback(null, JSON.parse(dog));
                    }else{
                        /* using async to talk to 'request' */
                        // does not exist: go get the end point
                        r({url: 'http://localhost:3001/dog'}, function(error, response, body){
                            if (error) {
                                callback({service: 'dog', error: error});
                                return;
                            }
                            if (!error && response.statusCode === 200) {
                                callback(null, body.data);
                                /* set "key/url" into 'redis' by stringifying the JSON object returned */
                                // client.set('http://localhost:3001/dog', JSON.stringify(body.data), function(error, dog){
                                /// for setting up the expiry of the key (key, time in sec, data) ///
                                client.setex('http://localhost:3001/dog', 25, JSON.stringify(body.data), function(error, dog){
                                    if (error) {
                                        throw error;
                                    }
                                });
                            }else{
                                callback(response.statusCode);
                            }
                        });
                    }
                });

            }
        },
        // when all done
        function(error, results){
            /* do not put blocking conditions here */
            // sending down the pipe response.json
            res.json({
                error: error,
                results: results
            });
        });

        // telling to hit the dog server
        // passing the uri object to hit the end point
        /*
        r({uri: 'http://localhost:3001/dog'}, function(error, response, body){
            if (!error && response.statusCode === 200) {
                res.json(body);
            }else{
                res.send(response.stausCode);
            }
        });
        */
    });

    app.get('/ping', function(req, res){
        res.json({pong: Date.now()});
    });

};
