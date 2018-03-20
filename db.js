var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/muehle', function (){
})
.then(function (rest){
	console.log('mongodb connected')
})
.catch(function(fallback){
	console.log(fallback)
})

module.exports = mongoose
