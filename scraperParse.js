
const requestPromise = require('request-promise');
const cheerio = require('cheerio');


const scraperParse = function(url){
return requestPromise(url)
  .then(function(html){
    var title = cheerio('h1', html).slice(1).eq(0).text().substring(4);
    var t = new Date();
    var hh= t.getHours();
    var mm = t.getMinutes();
    var ss = t.getSeconds();
    var time = hh+":"+mm+":"+ss;

    return {
      title: title,
      price: cheerio('span[class=price]', html).html(),
      imgURL: cheerio('img', html).attr("src"),
      url: url,
      time: time,
    };
  })
  .catch(function(error){
    console.log('there was an error!' + error);
  });

};

module.exports = scraperParse;
