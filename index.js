require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const path = require('path')
const routes = require('./routes')
const usersRoute = require('./routes/users')
var User = require('./models/user')
var Item = require('./models/item')
const flash = require('express-flash')
const methodOverride = require('method-override');


// Authentication/session packages
const passport = require('passport')
const SteamStrategy = require('passport-steam').Strategy;
const session = require('express-session')

// MongoDB related packages
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
    secure: false
  }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  User.findOne(user.id, function (err, user) {
    return done(null, user);
  });
});



passport.use(new SteamStrategy({
    returnURL: `http://192.168.3.35:${port}/auth/steam/return`,
    realm: `http://192.168.3.35:${port}/`,
    apiKey: process.env.STEAM_API_KEY
  },
  function (identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      User.findOne({
        steamid: profile.id
      }, function (err, user) {


        let newItem = new Item({
          name: "Shit",
          iconUrl: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfw-bbeQJR4-O4nYeDg8j5Nr_Yg2Yfv8Ah3L3E8dujjga3qRU9amH0I9OVelM-MlqCqQK3wOi70ZHo6MydwWwj5HfVytjphg/96fx96f",
          description: "something"
        })

        // user.items.push(newItem)
        // newItem.save()
        // user.save()
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



app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));


// Static files (CSS, Images, etc)
app.use(express.static(__dirname + '/public'));

// Sets up the routes
app.use('/', routes);
app.use('/users', usersRoute);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})