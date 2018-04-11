var request = require('request'); 
var cheerio = require("cheerio");


var scrape = function(cb) {
   // First, we grab the body of the html with request
   request("http://www.chicagotribune.com/", function(err, res, body) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(body);

    var articles = [];
    
    // Now, we grab every h2 within an article tag, and do the following:
    $(".trb_outfit_primaryItem_article").each(function(i, element) {
      
      var head = $(this).children(".trb_outfit_primaryItem_article_title.trb_outfit_featuredArticleTitle").text().trim();

      // Then we grab any children with the class of summary and then grab it's inner text
      // We store this to the sum variable. This is the article summary
      var sum = $(this).children(".trb_outfit_primaryItem_article_content").text().trim();

      // So long as our headline and sum aren't empty or undefined, do the following
      if (head && sum) {

        // This section uses regular expressions and the trim function to tidy our headlines and summaries
        // We're removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        // Initialize an object we will push to the articles array

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat
        };

        articles.push(dataToAdd);
      }
    });
    // After our loop is complete, send back the array of articles to the callback function
    cb(articles);
  });
};

module.exports = scrape;
