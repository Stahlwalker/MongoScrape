var scrape = require("../scripts/scrape");
var headlineController = require("../controllers/headlines");
var noteController = require("../controllers/notes");

module.exports = function (router) {
  router.get("/", function (req, res) {
    res.render("home");
  });

  router.get("/saved", function (req, res) {
    res.render("saved");
  });

  // This route handles scraping more articles to add to our db
  router.get("/api/fetch", function (req, res) {

    headlineController.fetch(function (err, docs) {
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "No new articles today. Check back tomorrow!"
        });
      } else {
        res.json({
          message: "Added " + docs.insertedCount + " new articles!"
        });
      }
    });
  });

  router.get("/api/headlines", function (req, res) {
    var query = {};
    if (req.query.saved) {
      query = req.query;
    }

    headlineController.get(query, function (data) {
      res.json(data);
    });
  });

  router.delete("/api/headlines/:id", function (req, res) {
    var query = {};
    query._id = req.params.id;
    headlineController.delete(query, function (err, data) {
      res.json(data);
    });
  });

  router.patch("/api/headlines", function (req, res) {
    headlineController.update(req.body, function (err, data) {
      res.json(data);
    });
  });

  router.get("/api/notes/:headline_id?", function (req, res) {
    var query = {};
    if (req.params.headline_id) {
      query._id = req.params.headline_id;
    }
    noteController.get(query, function (err, data) {
      res.json(data);
    });
  });

  router.delete("/api/notes/:id", function (req, res) {
    var query = {};
    query._id = req.params.id;

    noteController.delete(query, function (err, data) {
      res.json(data);
    });
  });

  router.post("/api/notes", function (req, res) {
    noteController.save(req.body, function (data) {
      res.json(data);
    });
  });
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
