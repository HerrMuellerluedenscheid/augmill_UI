// Based on this example:
// https://www.fusioncharts.com/dev/using-with-server-side-languages/tutorials/creating-interactive-charts-using-node-express-and-mongodb.html
// Allerdings sind vorher gelernte Sachen hier weniger schoen
// umgesetzt.
// Use Router object to use this module as middleware
var router = require('express').Router()

// using mongodb directly, here instead of mongoose
var mongodb = require('mongodb')
var dbHost = "mongodb://localhost:27017/muehle"
var dbObject;
var MongoClient = mongodb.MongoClient;

MongoClient.connect(dbHost, function(err, db){
  if (err) throw err;
  dbObject = db;
})

// Serves the power data at this url
router.get('/api/power/:tmin/:column', function(req, res, next) {


          var tmin =  new Date(parseInt(req.params.tmin));

          // dbObject.collection("power").find({"time" : {$gte : tmin}}).toArray(function(err, docs){
            console.log(req.params)
          dbObject.collection(req.params.column).find({"time" : {$gte : tmin}}).toArray(function(err, docs){
          if ( err ) throw err;
          var dateArray = [];
          var counts = [];
       
          for ( index in docs ){
            var doc = docs[index];
            //category array
            var t = doc['time'];
            var y = doc[req.params.column];
            //series 2 values array
            var count = doc[req.param.column];
            dateArray.push({"time": t});
            counts.push({"value" : count});
          }
       
          var dataset = [
            {
              "seriesname" : req.params.column,
              "data" : counts
            },
          ];
       
          var response = {
            "dataset" : dataset,
            "categories" : dateArray
          };

          res.json(response);
        });
      }
    )

module.exports = router