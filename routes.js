var express = require('express');
var controller = require('./controllers/controller')
var router = express.Router();
var profileController = require('./controllers/profileController')
var passport = require('passport');

const {
  check,
  validationResult
} = require('express-validator')

function isAuthorized(roles) {
  return async function (req, res, next) {
    let userRole

    if (req.user === undefined) {
      userRole = 'visitor'
    } else {
      userRole = req.user.userType
    }

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).send({
        error: {
          status: 403,
          message: 'Access denied.'
        }
      })
    }
    next()
  }
}

router.get('/', controller.refreshInventory, controller.renderHome);
router.post('/search', controller.renderInventory);

router.get('/auth/steam',
  passport.authenticate('steam', {
    failureRedirect: '/'
  }),
  function (req, res) {
    res.redirect('/');
  });

router.get('/auth/steam/return',

  passport.authenticate('steam', {
    failureRedirect: '/profile'
  }),
  function (req, res) {
    res.redirect('/');
  });

router.get('/profile', isAuthorized(['admin', 'user']), profileController.renderProfile)

router.get('/inventory', isAuthorized(['admin', 'user']), controller.renderInventory)

router.post('/logout', isAuthorized(['admin', 'user']), profileController.logout)

router.get('/session', isAuthorized(['admin', 'user']), (req, res) => {
  res.send(req.user)
})

router.put('/profile/email', isAuthorized(['admin', 'user']), check('email').isEmail(), (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('emailFailure', 'Please check your email.')
    res.redirect('/profile')

  } else {
    profileController.updateEmail(req, res)
  }
})

router.get('/admin', isAuthorized(['admin']), (req, res) => {
  res.render('admin')
})

router.delete('/profile', isAuthorized(['admin', 'user']), profileController.deleteProfile)



module.exports = router;