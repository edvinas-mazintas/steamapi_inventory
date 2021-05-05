const {
  response
} = require("express");
const axios = require("axios");


var Item = require('../models/item')

var itemImageUrl = 'https://steamcommunity-a.akamaihd.net/economy/image/';
var urls = [];

exports.renderHome = function (req, res) {
  res.render('home', {
    user: req.user
  });
}

exports.refreshInventory = function (req, res) {

  let steamid = req.user.steamid
  let url = 'http://steamcommunity.com/inventory/' + steamid + '/730/2?l=english';

  Item.deleteMany({
    ownerSteamid: steamid
  }, (err, result) => {

  })

  axios.get(url).then((response) => {
      response.data.assets.forEach(asset => {
        response.data.descriptions.forEach(description => {
          if (asset.classid === description.classid) {
            urls.push(itemImageUrl + description.icon_url + "/96fx96f");

            let newItem = new Item({
              name: description.name,
              ownerName: req.user.personaname,
              ownerSteamid: req.user.steamid,
              iconUrl: itemImageUrl + description.icon_url + "/96fx96f",
              description: "Nothing"
            })

            newItem.save()
          }
        })
      })

      res.render('inventory', {
        urls: urls,
        steamid: steamid,
        shouldError: false
      });
      urls = [];
    })
    .catch(err => {
      req.flash('ownershipFailure', 'You do not own CSGO')
      res.render('inventory')
    });
}