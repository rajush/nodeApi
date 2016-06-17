var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Connecting to mongodb using mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dogs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: true
}));

// requiring a path for dogs
var dogRoutes = require('./routes/dog.js')(app);

var server = app.listen(3001, function(){
    console.log('Server running at http://127.0.0.1:3001/');
});
