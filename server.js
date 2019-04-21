var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var Data = require('./models/office');
var app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://[username]:[password]@locations-ibwpx.mongodb.net/places?retryWrites=true', { useNewUrlParser: true }, function(err){
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

    
    locations = ["account division","medical","public relation officer","scholarship inquiry","administrative office","waiting room","academic council","senate","dean","admission committee","anti-ragging committee","international relations","vice chancellor","chancellor","pro vice chancellor","director","chief vigilance officer","rti nodal officer","registrar","library","reading room","distance and online learning","incubation center","training and placement cell","research cell","innovative cell","auditorium 1","auditorium 2","auditorium 3","conference room 1","conference room 2","department of mechanical engineering","department of civil engineering","mechanical labs","civil labs","classroom of mechanical","classroom of civil","department of electronics and telecommunication","department of electrical engineering","electronics laboratory","classroom of electricals","classroom of extc","computer laboratory","it laboratory","department of computer engineering","department of information technology","classroom of computer engineering","classroom of information technology","canteen","atm","stationary shop","xerox center","healthcare and medical","department of science","department of mathematics","physics lab","chemistry lab","department of chemical engineering","communication lab","department of communication","language lab","art room","hostel incharge","hostel wwarden","girl's hostel","boy's hostel","sport committee","cultural committee","gym"]
    rest_locations = ["security","parking","washroom","drinking water","lift"]
    var a = locations.indexOf(x);
    var b = rest_locations.indexOf(x);
    var flag = "no"

    if ((a==-1) && (b==-1)){
      flag = "no";
    }
    else if (a != -1){
      flag = "yes"
    }
    else{
      flag = "manual"
    }
    var speech ="";
    switch(flag){

      case "yes":

        var place = result.place;
        place = place.toUpperCase();
        var room = "Room no." + String(result.room);
        var floor = result.floor + " Floor";
        var block = "\"" + result.block + "\" Block";
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
        break;

      case "no":
        speech = "Location not found, please contact campus staff for navigation";
        res.json({
        fulfillmentText: speech,
        source: "Team .Onion"
      });
        break;

      case "manual":
        switch(x){
          case "washroom":
          speech = "Washroom is available at all the floors of all 6 block!";
          res.json({
            fulfillmentText: speech,
            source: "Team .Onion"
          });
          break;

          case "security":
          speech = "Security Guards are available at Entrance gate of the all blocks, Main Security incharge office is located at Ground Floor of Block \"A\"";
          res.json({
            fulfillmentText: speech,
            source: "Team .Onion"
          });
          break;
            
          case "parking":
          speech = "For Visitors, Parking Slot is available near the main entrance gate";
          res.json({
            fulfillmentText: speech,
            source: "Team .Onion"
          });
          break;

          case "drinking water":
          speech = "Water Cooler is located at both the end of floors i.e. just outside of washrooms.";
          res.json({
            fulfillmentText: speech,
            source: "Team .Onion"
          });
          break;

          case "lift":
          speech = "Lifts are located at center of each floor.";
          res.json({
            fulfillmentText: speech,
            source: "Team .Onion"
          });
          break;
        }
      break;

      default:
      speech = "Server is busy, please contact campus staff for navigation";
      res.json({
      fulfillmentText: speech,
      source: "Team .Onion"
    });

    } //switch end


  });
});

app.listen(process.env.PORT || 8081, function() {
  console.log("Server up and listening");
});
