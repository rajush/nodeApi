var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: true
}));

/* We are not using mongoose here because petServer is not using database
*  but it is just aggtegating from cat and dog server */

// requiring a path for pets
var petRoutes = require('./routes/pet.js')(app);

var server = app.listen(3000, function(){
    console.log('Server running at http://127.0.0.1:3002/');
});
