var express = require('express');
var router = express.Router();



function ensureLoggedIn() {
    return function (req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.status(401).send({
                success: false,
                message: 'You need to be authenticated to access this page!'
            })
        } else {
            next()
        }
    }
}

// Create user
router.post('/new', (req, res) => {
    res.send("Create user")
});

// Change email
router.patch('/', (req, res) => {
    res.send("Patch user email")
});


// Set email
router.post('/editAccount', ensureLoggedIn, (req, res) => {
    res.send("Edit user account!")
});


module.exports = router;