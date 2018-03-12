var express = require('express')
var router = express.Router()

// Read assets. Thats where app.js roams, serving java script controllers.
router.use(express.static(__dirname + '/../assets'))

router.get('/', function(req, res) {
	res.sendFile('app.html', {root: __dirname + '/../layouts'})
})

module.exports = router
