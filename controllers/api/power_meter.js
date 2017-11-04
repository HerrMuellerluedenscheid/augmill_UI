// Based on this example:
// https://www.fusioncharts.com/dev/using-with-server-side-languages/tutorials/creating-interactive-charts-using-node-express-and-mongodb.html
// Allerdings sind vorher gelernte Sachen hier weniger schoen
// umgesetzt.
// Use Router object to use this module as middleware
var router = require('express').Router()

// using mongodb directly, here instead of mongoose
var mongodb = require('mongodb')
var dbHost = "mongodb://localhost:27017/mydb"
var dbObject;
var MongoClient = mongodb.MongoClient;

MongoClient.connect(dbHost, function(err, db){
  if (err) throw err;
  dbObject = db;
})

// Serves the posts at this url
router.get('/api/power', function(req, res, next) {
        //use the find() API and pass an empty query object to retrieve all records
        dbObject.collection("mycoll").find({}).toArray(function(err, docs){
          if ( err ) throw err;
          var dateArray = [];
          var counts = [];
       
          for ( index in docs){
            var doc = docs[index];
            //category array
            var t = doc['time'];
            //series 2 values array
            var count = doc['count'];
            dateArray.push({"label": t});
            counts.push({"value" : count});
          }
       
          var dataset = [
            {
              "seriesname" : "Datum",
              "data" : counts
            },
          ];
       
          var response = {
            "dataset" : dataset,
            "categories" : dateArray
          };

          res.json(response)
        });
      }
    )

module.exports = router