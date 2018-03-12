var express = require('express')
var bodyParser = require('body-parser')
var app = express()

var port = 3000


app.use(bodyParser.json())

// Serves the posts at this url. Use the routing...
app.use(require('./controllers/api/posts'))

// Serves the posts at this url. Use the routing...
app.use(require('./controllers/api/power_meter'))

// serves the static (html) file
app.use(require('./controllers/static'))

app.use(require('./controllers/cleaning'))

app.listen(port, function(){
	console.log('Server listening on', port)
})
