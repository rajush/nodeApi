// request allows to make http calls to secondary servers.
// aggregator server that connects to all other servers
var r = require('request').defaults({
    json: true // returning data
});

var async = require('async');

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
                    };
                    if(!error && response.statusCode === 200){
                        callback(null, body.data);
                    }else{
                        callback(response.statusCode);
                    }
                });
            },
            dog: function(callback){
                r({url: 'http://localhost:3001/dog'}, function(error, response, body){
                    if (error) {
                        callback({service: 'dog', error: error});
                        return;
                    };
                    if (!error && response.statusCode === 200) {
                        callback(null, body.data);
                    }else{
                        callback(response.statusCode);
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
    })

}
