let Schema = require('mongoose').Schema
let mongoose = require('mongoose')

let item = new Schema({
    name: String,
    ownerName: String,
    ownerSteamid: String,
    iconUrl: String,
    description: String
    
});

const model = mongoose.model('items', item);

module.exports = model;

