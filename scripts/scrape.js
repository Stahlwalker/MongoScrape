var request = require('request');
var cheerio = require("cheerio");


var scrape = function (cb) {

  request("http://www.chicagotribune.com/", function (err, res, body) {

    var $ = cheerio.load(body);

    var articles = [];

    //Grab every h2 article
    $(".trb_outfit_primaryItem_article").each(function (i, element) {

      var head = $(this).children(".trb_outfit_primaryItem_article_title.trb_outfit_featuredArticleTitle").text().trim();

      var sum = $(this).children(".trb_outfit_primaryItem_article_content").text().trim();

      if (head && sum) {

        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat
        };

        articles.push(dataToAdd);
      }
    });

    cb(articles);
  });
};

module.exports = scrape;

//Chicago Tribune working
