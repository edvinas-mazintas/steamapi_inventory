let Schema = require('mongoose').Schema
let mongoose = require('mongoose')
const items = require('./item')

let user = new Schema({
    steamid: String,
    email: {type: String, default: null, required: false},
    personaname: String,
    profileurl: String,
    avatar: String,
    userType: {
        type: String,
        role: ['user', 'admin'],
        default: 'user'
    },
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "items"
    }]
});

const model = mongoose.model('users', user);

module.exports = model;

