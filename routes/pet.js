// request allows to make http calls to secondary servers.
// aggregator server that connects to all other servers
var r = require('request').defaults({
    json: true // returning data
});

module.exports = function(app){

    // Read
    app.get('/pets', function(req, res){

        // telling to hit the dog server
        // passing the uri object to hit the end point
        r({uri: 'http://localhost:3001/dog'}, function(error, response, body){
            if (!error && response.statusCode === 200) {
                res.json(body);
            }else{
                res.send(response.stausCode);
            }
        });
        
    });

}
