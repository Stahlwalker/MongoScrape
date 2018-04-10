// Bring in our scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// Bring in the Headline and Note mongoose models
var Headline = require("../models/Headline");

module.exports = {
  fetch: function(cb) {

    // Run scrape function
    scrape(function(data) {
      // Here data is an array of article objects with headlines and summaries
      // Setting this to articles for clarity
      var articles = data;
      // Make sure each article object has a date and is not saved by default
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }
      // Headline.collection lets us access the native Mongo insertMany method.
      // We're using this instead of the mongoose create method because here we may
      // specify whether this is an ordered or unordered insert
      // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/
      // unordered inserts have the benefit of being faster, and errors are logged instead
      // of thrown. This means that even if some of our inserts fail, the rest will continue
      // We expect an insert to fail whenever we have a duplicate headline since that property
      // is marked unique on the mongoose model
      Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
        cb(err, docs);
      });
    });
  },
  delete: function(query, cb) {
    Headline.remove(query, cb);
  },
  get: function(query, cb) {
    // Prepare a query to get the data we scraped,
    // and sort starting from most recent (sorted by id num)
    Headline.find(query)
      .sort({
        _id: -1
      })
      // Execute this query
      .exec(function(err, doc) {
        // Once finished, pass the list into the callback function
        cb(doc);
      });
  },
  update: function(query, cb) {
    // Update the headline with the id supplied
    // set it to be equal to any new values we pass in on query
    Headline.update({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
};

// // Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//       .then(function(dbArticle) {
//         // If we were able to successfully find Articles, send them back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  
//   // Route for grabbing a specific Article by id, populate it with it's note
//   app.get("/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//       // ..and populate all of the notes associated with it
//       .populate("note")
//       .then(function(dbArticle) {
//         // If we were able to successfully find an Article with the given id, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  
//   // Route for saving/updating an Article's associated Note
//   app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//       .then(function(dbNote) {
//         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//       })
//       .then(function(dbArticle) {
//         // If we were able to successfully update an Article, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
