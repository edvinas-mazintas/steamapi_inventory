const express = require('express')
const app = express()
const port = process.env.PORT || 8888
const path = require('path')
var bodyParser = require('body-parser')  
var routes = require('./routes')



app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:false}))  

app.use(express.static(__dirname + '/public'));
app.use('/', routes);
    // "nodemon": "nodemon index.js"
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})