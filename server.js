var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// var request = require('request'); 
var exphbs = require('express-handlebars');

var PORT = 3000 || process.env.PORT;

// Initialize Express
var app = express();

var router = express.Router();

require("./config/routes")(router);

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// var cheerio = require("cheerio");

// Require all models
// var Article = require("./models/index.js");


// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

//every request go through router middlesware
app.use(router);

//if deployed use database otherwise locoal mongo
var MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/newsdb";


// Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, {
//   useMongoClient: true
// });


mongoose.connect(MONGO_URI, function(error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log("mongoose connection success")
  }
  });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT +"!");
});
