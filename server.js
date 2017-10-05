var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var FACT_COLLECTION = "factbook";
var QUERY_COLLECTION = "queries";

var app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
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

function capitalizeFirstLetter(string) {
  string = string.trim();
  string = string.replace("includes ","");
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.get("/api/earth", function(req, res) {

  var earth = db.collection(FACT_COLLECTION).findOne({"People and Society.Population.text": /7,323,187,457/});
  
  earth.then(function(data){
    var world = {};
    var population;
    var name = "World";
    var age = {"Leave blank": 100};
    var gender = {};
    var religions = {"Leave blank": 100};
    var ethnicGroups = {"Leave blank": 100, "No data available": 100};
    var extraText = data["People and Society"]["Population"]["text"].match(/\s\([a-zA-Z]{0,4}\s?20\d\d est.\)/);
    population = parseInt(data["People and Society"]["Population"]["text"].slice(0,extraText.index).replace(/,/g, ""));
    var ageObject = data["People and Society"]["Age structure"];
    for(var range in ageObject){
      if (!ageObject.hasOwnProperty(range)) {
        //The current property is not a direct property of p
        continue;
      }
      else{
        age[range] = parseFloat(ageObject[range]["text"]);
      }
    }
    var genderObject = data["People and Society"]["Sex ratio"];
    for(var range in genderObject){
      if (!genderObject.hasOwnProperty(range)) {
        //The current property is not a direct property of p
        continue;
      }
      else{
        gender[range] = parseFloat(genderObject[range]["text"]);
        gender["Leave blank"] = parseFloat(genderObject["total population"]["text"]);
      }
    }
    var religionsRE = /([a-z\-\']*\s?[a-z\-\']*)(?:\s\([^)]+\))?\s(\d+\.?\d{0,2})%/ig;
    if(data["People and Society"]["Religions"] != undefined){
      var religionsString = data["People and Society"]["Religions"]["text"];
      var religionsArray;
      while ((religionsArray = religionsRE.exec(religionsString)) !== null) {
        religions[capitalizeFirstLetter(religionsArray[1])] = parseFloat(religionsArray[2]);
      }
      if(Object.keys(religions).length === 1){
        religions["No data available"] = 100;
      }
    }
    else{
      religions["No data available"] = 100;
    }
    world.name = name;
    world.population = population;
    world.age = age;
    world.gender = gender;
    world.religions = religions;
    world.ethnicGroups = ethnicGroups;

    res.status(200).json(world);
  });

});

app.get("/api/factbook", function(req, res) {
  db.collection(FACT_COLLECTION).find({ $and: [ {"Government.Country name.conventional short form.text": { $exists: true}}, {"People and Society.Population.text": { $ne: "uninhabited"}}, {"People and Society.Population.text": { $ne: "no indigenous inhabitants"}}, {"People and Society.Population.text": { $ne: "no indigenous inhabitants, but there are both permanent and summer-only staffed research stations"} } ] }).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get countries.");
    } else {
      var populations = [];

      docs.forEach(function(country){
        var parsedCountry = {};
        var population;
        var name;
        var age = {"Leave blank": 100};
        var gender = {};
        var religions = {"Leave blank": 100};
        var ethnicGroups = {"Leave blank": 100};
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
            if(range!=="at birth"){
              gender[range] = parseFloat(genderObject[range]["text"]);
            }
          }
        }
        
        var religionsRE = /([a-z\-\']*\s?[a-z\-\']*\s?[a-z\-\']*)(?:\s\([^)]+\))?\s(\d+\.?\d{0,2})%/ig;
        if(country["People and Society"]["Religions"] != undefined){
          var religionsString = country["People and Society"]["Religions"]["text"];
          var religionsArray;
          while ((religionsArray = religionsRE.exec(religionsString)) !== null) {
            if(religionsArray[1].indexOf("less than")==-1){
              religions[capitalizeFirstLetter(religionsArray[1])] = parseFloat(religionsArray[2]);
            }
          }
          if(Object.keys(religions).length === 1){
            religions["No data available"] = 100;
          }
        }
        else{
          religions["No data available"] = 100;
        }

        if(country["People and Society"]["Ethnic groups"] != undefined){
          var ethnicString = country["People and Society"]["Ethnic groups"]["text"];
          var ethnicArray;
          while ((ethnicArray = religionsRE.exec(ethnicString)) !== null) {
            ethnicGroups[capitalizeFirstLetter(ethnicArray[1])] = parseFloat(ethnicArray[2]);
          }
          if(Object.keys(ethnicGroups).length === 1){
            ethnicGroups["No data available"] = 100;
          }
        }
        else{
          ethnicGroups["No data available"] = 100;
        }
        
        parsedCountry.name = name;
        parsedCountry.population = population;
        parsedCountry.age = age;
        parsedCountry.gender = gender;
        parsedCountry.religions = religions;
        parsedCountry.ethnicGroups = ethnicGroups;
        populations.push(parsedCountry);
      });
      res.status(200).json(populations);
    }
  });
});

app.get("/api/query/:country/:age/:gender/:religion/:ethnicity", function(req, res) {
  db.collection(QUERY_COLLECTION).find({ $and: [ { country: req.params.country }, { age: req.params.age }, { gender: req.params.gender }, { religion: req.params.religion }, { ethnicity: req.params.ethnicity } ] }).toArray(function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get query");
    } else {
      if(doc.length==0){
        db.collection(QUERY_COLLECTION).find({ count: 0}).toArray(function(err, doc){
          res.status(200).json(doc[0]);
        });
      }
      else{
        res.status(200).json(doc[0]);
      }
    }
  });
});

app.post("/api/query/create", function(req, res) {
  var newQuery = req.body;
  newQuery.createDate = new Date();

  db.collection(QUERY_COLLECTION).insertOne(newQuery, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to save new query.");
    } else {
      //console.log(doc.ops[0]);
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.put("/api/query/update/:country/:age/:gender/:religion/:ethnicity", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(QUERY_COLLECTION).updateOne({ $and: [ { country: req.params.country }, { age: req.params.age }, { gender: req.params.gender }, { religion: req.params.religion }, { ethnicity: req.params.ethnicity } ] }, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update query");
    } else {
      res.status(200).json(updateDoc);
    }
  });
});