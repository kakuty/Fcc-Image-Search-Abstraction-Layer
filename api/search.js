'use strict';

var request = require('request');

module.exports = function(app, ImageSearch) {
  app.get("/api/imagesearch/:q(*)", function (req, res) {
    var searchTerm = req.params[0];
    var offset = req.query.offset;
    var url = process.env.URL;
    var num = offset || process.env.NUM_RESULT
    var qs = {
      q: searchTerm,
      cx: process.env.CX,
      key: process.env.API,
      searchType:'image',
      num:num
    }
    
    request({url:url, qs:qs}, function(err, response, body) {
      if(err) throw err;
      
      var result = [];
      var resultItems = [];
      try {
        resultItems = JSON.parse(body).items
      } catch(err) {
        throw err
      }
      
      resultItems.forEach(function(resultItem) {
        var item = {}
        item.url = resultItem.link;
        item.snippet = resultItem.snippet;
        item.thumbnail = resultItem.image.thumbnailLink;
        item.context = resultItem.image.contextLink;
        
        result.push(item)
      })
      
      var searchObj = new ImageSearch({
        searchTerm: searchTerm,
        dateCreated: Date.now()
      })
      
      searchObj.save(function(err, searchObj) {
        if(err) return console.error(err)
      })
      
      res.send(result);
    })
  });
  
  app.get("/latest/imagesearch/", function (req, res) {
    ImageSearch.find()
    .sort('-dateCreated')
    .limit(10)
    .exec(function(err, searchTerms) {
      var result = searchTerms.map((obj) => {
        return {
          term: obj.searchTerm,
          when: obj.dateCreated
        }
      })
      
      res.send(result)
    })
  })
}