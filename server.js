var
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  request = require('request'),
  mongoose = require('mongoose'),
  logger = require('morgan'),
  dotenv = require('dotenv').load({silent: true}), // silent: true just ensures the program doesn't throw an error if it can't find the dotenv file
  nutritionix = require('nutritionix')({
      appId: "027e373f",
      appKey: "4d32fcc05f9358d893602b98daa6a6f7"
  }, false),
  PORT = process.env.PORT || 3000 // heroku doesn't like port 3000 so this ensures heroku will pick its own port or use 3000


app.use(bodyParser.json());


app.post('/', function(req, res) {

  var body = {
                appId:"027e373f",
                appKey:"4d32fcc05f9358d893602b98daa6a6f7",
                query:"Kashi",
                fields:["item_name","brand_name","nf_calories","nf_serving_size_qty","nf_serving_size_unit", "nf_sugars"],
                sort:{
                  field:"_score",
                  order:"desc"
                },
                filters:{
                  item_type:2
                }
              }

  request({
    method: 'POST',
    json: true,
    url: "https://api.nutritionix.com/v1_1/search/",
    body: body
  }, function(err, response, body){
    if (err) return console.log(err);
    res.json(response.body)
  })
})





// Connec to server
app.listen(PORT, function(){
  console.log('Server is running on port: ', PORT);
})
