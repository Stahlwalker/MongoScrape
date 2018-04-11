var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// var request = require('request'); 
var exphbs = require('express-handlebars');

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

var router = express.Router();

require("./config/routes")(router);

// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: false
}));

//every request go through router middlesware
app.use(router);

//if deployed use database otherwise locoal mongo
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";

mongoose.connect(MONGODB_URI, function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("mongoose connection success")
  }
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});


//heroku working but local host isn't
