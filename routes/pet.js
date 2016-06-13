// request allows to make http calls to secondary servers
var r = require('request').defaults({
    json: true
});

module.exports = function(app){

    // Read
    app.get('pets', function(req, res){
        r({uri: 'http://localhost:3001/dog'}, function(error, response, body){
            if (!eror && response.statusCode === 200) {
                res.json(body);
            }else{
                res.send(response.stausCode);
            }
        });
    });

}
