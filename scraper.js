//require npm packages
const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const scraperParse = require('./scraperParse');
const Json2csvParser = require('json2csv').Parser;
const json2csv = require('json2csv').parse;
var fs = require('fs');

//set entry point
const url = 'http://shirts4mike.com/shirts.php';

//check/create data folder
var directory = './data';
if (!fs.existsSync(directory)){
  fs.mkdirSync(directory);
}

requestPromise(url)
  .then(function(html){
    //success
    const teeShirtLinks = [];
    for (let i = 0; i < 15; i++){
      if(cheerio('a[href]', html)[i].attribs.href.startsWith('shirt.php?')){
          teeShirtLinks.push(cheerio('a[href]', html)[i].attribs.href);
      }
    }
    return Promise.all(
      teeShirtLinks.map(function(url){
        return scraperParse('http://shirts4mike.com/' + url);
      })
    );
  })
  .then(function (shirts){
    console.log(shirts);
    //console.log(shirts[1].price);

    //format date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var today = yyyy +'-'+ mm + '-'+ dd;


    const json2csvParser = new Json2csvParser({ shirts });
    const csv = json2csvParser.parse(shirts);

    //write to file
    fs.writeFile(`./data/${today}.csv`, csv, function(error){
      if (error) throw error;
      console.log('File Saved.');
    });

  })
  .catch(function(error){
    console.log('There was an error ' + error);
  });
