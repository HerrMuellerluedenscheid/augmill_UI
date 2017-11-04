// model that represents a single post

var db = require('../db') // connect to mongodb
var Post = db.model('Post', {
	username: {type: String, required: true},
	body: {type: String, required: true},
	date: {type: Date, required: true, default: Date.now}
})

module.exports = Post