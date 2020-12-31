const { response } = require("express");
const axios = require("axios");

var itemImageUrl ='https://steamcommunity-a.akamaihd.net/economy/image/';
var json;
var items = [];
var itemDescriptions = [];
var urls = [];
exports.addItems = function addItems(req, res){
  var gameCode = '96fx96f';
  var itemImageUrl ='https://steamcommunity-a.akamaihd.net/economy/image/';
  
}


exports.getJSON = function(req, res){
  var url = 'http://steamcommunity.com/inventory/76561198079713154/730/2?l=english';
  axios.get(url).then((response) => {
    response.data.assets.forEach(asset => {
      response.data.descriptions.forEach(description => {
        if(asset.classid === description.classid){
          urls.push(itemImageUrl + description.icon_url + "/96fx96f");
        }
        
      });
    });

    res.render('home', {
      urls : urls
    });

    urls = [];
  })
  .catch(err => {
    console.error(err);
  });
}

exports.getJSONPost = function(req, res){


  var steamid = req.body.steamid;
  var url = 'http://steamcommunity.com/inventory/76561198079713154/730/2?l=english';
  url = 'http://steamcommunity.com/inventory/'+steamid+'/730/2?l=english';

  // if(!isNan(req.body.steamid)){
    
  // }
    axios.get(url).then((response) => {
      response.data.assets.forEach(asset => {
        response.data.descriptions.forEach(description => {
          if(asset.classid === description.classid){
            urls.push(itemImageUrl + description.icon_url + "/96fx96f");
          }
          
        })
        
      })
      res.render('home', {
        urls : urls
      });
      urls = [];
    })
    .catch(err => {
      res.render('home', {
        urls : urls
      });
    });

    

    
    
}