var express =  require('express');  
var controller = require('./controllers/controller')

var router = express.Router();

router.get('/', controller.getJSON);
router.post('/search', controller.getJSONPost);


module.exports = router;