// This function will make a formatted date for our scraped data
var makeDate = function () {
  var d = new Date();
  var formattedDate = "";
  formattedDate += (d.getMonth() + 1) + "_";
  formattedDate += d.getDate() + "_";
  formattedDate += d.getFullYear();
  return formattedDate;
};

// Export
module.exports = makeDate;
