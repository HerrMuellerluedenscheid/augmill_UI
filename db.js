var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/social', function (){
})
.then(function (rest){
	console.log('mongodb connected')
})
.catch(function(fallback){
	console.log(fallback)
})

module.exports = mongoose