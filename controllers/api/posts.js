var Post = require('../../models/post')

// Use Router object to use this module as middleware
var router = require('express').Router()

// Serves the posts at this url
router.get('/api/posts', function(req, res, next) {
	// calling 'find' on the 'Post' model and render posts as json 
	Post.find()
	.sort('-date')
	.exec(function(err, posts){
		if(err){ return next(err)}
		res.json(posts)
	})
})

router.post('/api/posts', function (req, res, next) {
	// When request comes: build a new Post object
	var post = new Post({
		username: req.body.username,
		body: req.body.body
	})

	// And save it
	post.save(function (err, post){
		if(err) {return next(err)}
		res.json(201, post)  // Not necessary
	})
})

module.exports = router