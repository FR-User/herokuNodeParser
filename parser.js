var cheerio = require('cheerio');
var request = require('request');

var url = "https://www.naver.com/";

request(url, function(error, response, html){
    if (error) {throw error};

    var newDoc = cheerio.load(html);
  
  newDoc('.nav_item').each(function(){
    console.log("HELLO! : " + newDoc(this).text());
  });

});