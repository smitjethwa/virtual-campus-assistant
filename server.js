var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var Data = require('./models/office');
var app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://smit:admin@locations-ibwpx.mongodb.net/places?retryWrites=true', { useNewUrlParser: true }, function(err){
    if(err){
        console.log('Not connected to the database');
    }else{
        console.log('Connection Established !!');
    }
});
// app.use(bodyParser.json());
// app.get('/', function (req, res) {
//    res.send('Hello World');
// });


app.post('/office', function( req, res){


  var x = req.body.queryResult.queryText.toLowerCase();
  Data.findOne({"place":x},function(err, result){
    if(err){
      console.log(err);
    }


    var place = result.place;
    var room = "Room no." + String(result.room);
    var floor = result.floor;
    var block = result.block;
    console.log(result);
    // console.log(result.floor);
    // console.log(result.room);
    // console.log(result.block);
    res.json({
  
    "fulfillmentText": "Hello from webhook",

    "source": "NodeJS",




  "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": "Please navigate to following location"
              }
            }
          ]
        },
        "systemIntent": {
          "intent": "actions.intent.OPTION",
          "data": {
            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
            "listSelect": {
              "title": place,
              "items": [
                {
                  "optionInfo": {
                    "key": "first title key"
                  },
                  "title": room
                },
                {
                  "optionInfo": {
                    "key": "second"
                  },
                  "title": floor
                },
                {
                  "optionInfo": {
                    "key": "third"
                  },
                  "title": block
                },
                
              ]
            }
          }
        }
      }
    }
  });




  });
});

app.listen(process.env.PORT || 8081, function() {
  console.log("Server up and listening");
});
