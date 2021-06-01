var express=require('express');
const bodyParser = require('body-parser');
var app=express();
const mysql = require("mysql");

app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/js'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const routes = require('./routes/routes.js')(app, mysql);

var server=app.listen(3013,function(){
console.log("We have started our server on port 3013");
});


