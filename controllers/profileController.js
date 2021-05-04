var User = require('../models/user')

exports.updateEmail = function (req, res, next) {

    const steamid = {
        steamid: req.user.steamid
    }
    const email = {
        email: req.body.email
    }

    User.findOneAndUpdate(steamid, email, (err, result) => {
        if (err) {
            res.send(err)
        }
        res.redirect('/profile') 
    });
}

exports.deleteProfile = function (req, res) {
    const steamid = {
        steamid: req.user.steamid
    }

    User.findOneAndDelete(steamid, (err, result) => {
        if (err) {
            res.send(err)
        }
        req.logout()
        res.redirect('/')

    });
}

exports.logout = function(req, res, next) {
    req.session.destroy((err) => {
      res.clearCookie('connect.sid');
      req.logout();
      res.redirect('/');
    });
}

exports.renderProfile = function(req, res){
    res.render('profile',{
        profilePicture : req.user.avatar,
        personaname: req.user.personaname,
        email: req.user.email
      })
}