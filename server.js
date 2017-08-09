var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var COLLECTION = "factbook";

var app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect("mongodb://heroku_4hl01spr:lhnj84jka2921l2o9hqi5c1t3h@ds161041.mlab.com:61041/heroku_4hl01spr", function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/", function(req, res) {
  db.collection(COLLECTION).find({"People and Society.Population.text": /7,323,187,457/ }).toArray(function(err, docs){
    var world = [];
    
    docs.forEach(function(world)){
      var world = {};
      var population;
      var name = "World";
      var age = {};
      var gender = {};
      var extraText = country["People and Society"]["Population"]["text"].match(/\s\([a-zA-Z]{0,4}\s?20\d\d est.\)/);
      population = parseInt(country["People and Society"]["Population"]["text"].slice(0,extraText.index).replace(/,/g, ""));
      var ageObject = country["People and Society"]["Age structure"];
        for(var range in ageObject){
          if (!ageObject.hasOwnProperty(range)) {
            //The current property is not a direct property of p
            continue;
          }
          else{
            age[range] = parseFloat(ageObject[range]["text"]);
          }
        }
        var genderObject = country["People and Society"]["Sex ratio"];
        for(var range in genderObject){
          if (!genderObject.hasOwnProperty(range)) {
            //The current property is not a direct property of p
            continue;
          }
          else{
            gender[range] = parseFloat(genderObject[range]["text"]);
          }
        }
        world.name = name;
        world.population = population;
        world.age = age;
        world.gender = gender;
        populations.push(world);
    }

    res.status(200).json(worlds);
  });
  
});

app.get("/api/factbook", function(req, res) {
  db.collection(COLLECTION).find({ $and: [ {"Government.Country name.conventional short form.text": { $exists: true}}, {"People and Society.Population.text": { $ne: "uninhabited"}}, {"People and Society.Population.text": { $ne: "no indigenous inhabitants"}}, {"People and Society.Population.text": { $ne: "no indigenous inhabitants, but there are both permanent and summer-only staffed research stations"} } ] }).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get countries.");
    } else {
      var populations = [];

      docs.forEach(function(country){
        var parsedCountry = {};
        var population;
        var name;
        var age = {};
        var gender = {};
        var extraText = country["People and Society"]["Population"]["text"].match(/\s\([a-zA-Z]{0,4}\s?20\d\d est.\)/);
        if(extraText){
          population = parseInt(country["People and Society"]["Population"]["text"].slice(0,extraText.index).replace(/,/g, ""));
        }
        else{
          population = parseInt(country["People and Society"]["Population"]["text"].replace(/,/g, ""));
        }
        if(country["Government"]["Country name"]["conventional short form"]["text"]!=="none"){
          name = country["Government"]["Country name"]["conventional short form"]["text"];
        }
        else{
          name = country["Government"]["Country name"]["conventional long form"]["text"];
        }
        var ageObject = country["People and Society"]["Age structure"];
        for(var range in ageObject){
          if (!ageObject.hasOwnProperty(range)) {
            //The current property is not a direct property of p
            continue;
          }
          else{
            age[range] = parseFloat(ageObject[range]["text"]);
          }
        }
        var genderObject = country["People and Society"]["Sex ratio"];
        for(var range in genderObject){
          if (!genderObject.hasOwnProperty(range)) {
            //The current property is not a direct property of p
            continue;
          }
          else{
            gender[range] = parseFloat(genderObject[range]["text"]);
          }
        }
        parsedCountry.name = name;
        parsedCountry.population = population;
        parsedCountry.age = age;
        parsedCountry.gender = gender;
        populations.push(parsedCountry);
      });
      res.status(200).json(populations);
    }
  });
});