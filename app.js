'use strict';
require("dotenv").config();

const express        = require('express');
const bodyParser     = require('body-parser');
const SwaggerExpress = require('swagger-express-mw');
const SwaggerUI      = require('swagger-tools/middleware/swagger-ui');
const _              = require('lodash');
const mongoHelper    = require('./api/helpers/mongoHelper');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlencodedParser = bodyParser.urlencoded({extended : false});

var flightSchema = new Schema({
    origin: String,
    destination: String,
    departureTime: String,
    cost: String
}, {
    collection: 'flight'
});

var Flight = mongoose.model('flights', flightSchema);
mongoose.connect('mongodb://localhost:27017/aa-mock-engine');

const app            = express();

app.set('view engine', 'ejs'); //template/view engine for express.js

const port = process.env.PORT || 3030;

module.exports = app; // for testing
let appRoot = __dirname;
global.appRoot = appRoot;
let config = {
  appRoot: appRoot     // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  app.use(SwaggerUI(swaggerExpress.runner.swagger));
  swaggerExpress.register(app);

  app.listen(port);

  console.log("App listening on ", port);

  // if (swaggerExpress.runner.swagger.paths['/hello']) {
  //   console.log('Listening on', port, '(Try: curl http://127.0.0.1:' + port + '/hello?name=Scott)');
  // }
});

start().catch(function(err) {
    console.log("Something went wrong... ", err);
});

function start() {
    var promises = [];

    // Do all async setup here, example:
    // let someAsyncCall = something();
    // promises.push(someAsyncCall);

    promises.push(mongoHelper.connectToDb());

    return Promise.all(promises).then(function(){
        console.log("\n\nSetup complete!");
    });
}


// ~~~~~ ROUTING ~~~~~
app.get('/', function(req, res) {
    //res.sendFile(__dirname + '/views/welcome.html');
    res.render('welcome');
});

app.get('/flightsinput', function(req, res){
    //res.sendFile(__dirname + '/views/flights.html');
    res.render('flights');
});

app.post('/flights', urlencodedParser, function(req,res){
    console.log(req.body);
    //look for data in database
    Flight.find({origin: req.body.dep, destination: req.body.des, departureTime: new RegExp(req.body.date, "i")}).then(function(result){
        console.log(result);
        res.render('flightsdisplay', {data: result});
    });
});
