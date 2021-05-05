require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const path = require('path')
const routes = require('./routes')
var User = require('./models/user')
var Item = require('./models/item')

const morgan = require('morgan');
const fs = require('fs');
const flash = require('express-flash')
const methodOverride = require('method-override');


const passport = require('passport')
const SteamStrategy = require('passport-steam').Strategy;
const session = require('express-session')

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')

app.use(methodOverride('_method'));


let connectionString = process.env.DB_STRING
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
mongoose.set('useFindAndModify', false);
db.on('error', console.error.bind(console, 'console error:'));
db.once('open', () => {
  console.log("MongoDB Connected!")
});


app.use(session({
  store: MongoStore.create({
    mongoUrl: connectionString
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash())


passport.use(new SteamStrategy({
    returnURL: `localhost:${port}/auth/steam/return`,
    realm: `localhost:${port}/`,
    apiKey: process.env.STEAM_API_KEY
  },
  function (identifier, profile, done) {
    process.nextTick(function () {
      User.findOne({
        steamid: profile.id
      }, function (err, user) {

        if (!err) {
          if (!user) {
            let newUser = new User({
              steamid: profile.id,
              personaname: profile._json.personaname,
              profileurl: profile._json.profileurl,
              avatar: profile._json.avatarfull
            });

            User.find().populate('items')
            newUser.save(function (err) {

            });
            return done(null, newUser);
          }
        }
        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  User.findOne({
    steamid: user.steamid
  }, function (err, user) {
    return done(err, user);
  });
});

app.use(morgan('common', {
  stream: fs.createWriteStream('./access.log', {
    flags: 'a'
  })
}))

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));


app.use(express.static(__dirname + '/public'));


app.use('/', routes);


app.listen(port, () => {
  console.log(`App listening at localhost:${port}`)
})