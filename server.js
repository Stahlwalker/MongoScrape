var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require('request'); 
var exphbs = require('express-handlebars');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var cheerio = require("cheerio");

// Require all models
var Article = require("./models/index.js");

var PORT = 3000 || process.env.PORT;
// Initialize Express
var app = express();

var routes = require("./routes");
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.engine("handlebars", exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

var MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/newsdb";
// Connect to the Mongo DB
mongoose.connect(MONGO_URI);

// Routes

app.use(routes);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
