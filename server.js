var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.use(bodyParser.json())

// Serves the posts at this url. Use the routing...
app.use(require('./controllers/api/posts'))

// Serves the posts at this url. Use the routing...
app.use(require('./controllers/api/power_meter'))

// serves the static (html) file
app.use(require('./controllers/static'))


app.use(require('d3-3'))
app.use(require('c3'))

app.listen(3000, function(){
	console.log('Server listening on', 3000)
})