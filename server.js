var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var mongodb = require('mongodb')

var port = 3000


app.use(bodyParser.json())

// Serves the posts at this url. Use the routing...
app.use(require('./controllers/api/system'))

// Serves the posts at this url. Use the routing...
app.use(require('./controllers/api/power_meter'))

// serves the static (html) file
app.use(require('./controllers/static'))

app.use(require('./controllers/cleaning'))

app.listen(port, function(){
	// using mongodb directly, here instead of mongoose
	var dbHost = "mongodb://localhost:27017/muehle"
	var dbObject;
	var MongoClient = mongodb.MongoClient;

	MongoClient.connect(dbHost, function(err, db){
	  if (err) {
		throw err;
		console.log('Cant connect mongo')
	  } else {
	  	process.send('ready')
	  }
	})
	console.log('Server listening on', port)
})
