const {
  response
} = require("express");
const axios = require("axios");

var itemImageUrl = 'https://steamcommunity-a.akamaihd.net/economy/image/';
var descriptions = [];
var urls = [];
exports.addItems = function addItems(req, res) {
  var gameCode = '96fx96f';
  var itemImageUrl = 'https://steamcommunity-a.akamaihd.net/economy/image/';

}


text_truncate = function (str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};


exports.renderHome = function (req, res) {
  res.render('home', {
    user: req.user
  });
}



// updateInventory = function (req, res){
//   var steamid = req.session.passport.user.steamid
//   url = 'http://steamcommunity.com/inventory/' + steamid + '/730/2?l=english';

//   axios.get(url).then((response) => {
//     response.data.assets.forEach(asset => {
//       response.data.descriptions.forEach(description => {
//         if (asset.classid === description.classid) {
//           urls.push(itemImageUrl + description.icon_url + "/96fx96f");
//           descriptions.push(description.name);
//         }

//       })

//     })
//     res.render('inventory', {
//       urls: urls,
//       descriptions: descriptions,
//       steamid: steamid,
//       shouldError: false
//     });
//     urls = [];
//     descriptions = [];
//   })
//   .catch(err => {
//     res.render('inventory', {
//       urls: urls,
//       descriptions: descriptions,
//       shouldError: true
//     });
//   });
// }





exports.refreshInventory = function (req, res) {
  var steamid = req.session.passport.user.steamid
  var url = 'http://steamcommunity.com/inventory/76561198079713154/730/2?l=english';
  url = 'http://steamcommunity.com/inventory/' + steamid + '/730/2?l=english';
  let shouldError = true;

  axios.get(url).then((response) => {
      response.data.assets.forEach(asset => {
        response.data.descriptions.forEach(description => {
          if (asset.classid === description.classid) {
            urls.push(itemImageUrl + description.icon_url + "/96fx96f");
            descriptions.push(text_truncate(description.name, 21, "..."));
          }

        })

      })
      res.render('inventory', {
        urls: urls,
        descriptions: descriptions,
        steamid: steamid,
        shouldError: false
      });
      urls = [];
      descriptions = [];
    })
    .catch(err => {
      res.render('inventory', {
        urls: urls,
        descriptions: descriptions,
        shouldError: true
      });
    });
}


