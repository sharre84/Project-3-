var
express = require('express'),
app = express(),
bodyParser = require('body-parser'),
request = require('request'),
mongoose = require('mongoose'),
logger = require('morgan'),
dotenv = require('dotenv').load({silent: true}), // silent: true just ensures the program doesn't throw an error if it can't find the dotenv file
ejs = require('ejs'),
ejsLayouts = require('express-ejs-layouts'),
flash = require('connect-flash'),
cookieParser = require('cookie-parser'), // used to read the cookies that are created
bodyParser = require('body-parser'),
session = require('express-session'), // used to create cookies
passport = require('passport'), // used for authentication
passportConfig = require('./config/passport.js'),
nodemailer = require('nodemailer'),
methodOverride = require('method-override'),
moment = require('moment'),
// googleButton = require('bootstrap-social'),
nutritionix = require('nutritionix')({
  appId: process.env.APPID,
  appKey: process.env.APPKEY
}, false),
PORT = process.env.PORT || 3000, // heroku doesn't like port 3000 so this ensures heroku will pick its own port or use 3000
userRoutes = require('./routes/users.js')

// connect to mongodb database
mongoose.connect(process.env.DB_URL, function(err){
  if (err) return console.log(err);
  console.log("Connected to MongoDB (project-3)");
})

// middleware
// app.use(googleButton)
app.use(bodyParser.json());
app.use(express.static('./public'))
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false})) // this allows us to use our forms with bodyparser
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(flash())

// this is the session and passport middleware
app.use(session({
  cookie: {_expires: 60000000}, // 16.6 hours in milliseconds
  secret: "Wazzzuuuup", // this adds an encrypter version of this secret so that a user cant just add a cookie in the browser and be logged in...very cruial
  resave: true, // if you are continually using the site, you will stay logged in as long as you want
  saveUninitialized: false // means, "do you want to create a cookie even if the login fails?".. answer is NO
}))
app.use(passport.initialize())
app.use(passport.session()) // this is what allows the cookie to get created, when necessary

app.use(function(req, res, next) {
  res.locals.user = req.user
  next()
})

app.post('/', function(req, res) {
  var body = {
    appId:"027e373f",
    appKey:"4d32fcc05f9358d893602b98daa6a6f7",
    query: req.body.query,
    results: 5,
    fields:["item_name","brand_name","nf_serving_size_qty", "nf_serving_size_unit", "nf_calories", "nf_protein", "nf_total_fat", "nf_total_carbohydrate", "images_front_full_url"],
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
    res.json(body)
  })
})

// for reference:
app.post('/autocomplete', function(req, res) {
  var body = {
    appId:"027e373f",
    appKey:"4d32fcc05f9358d893602b98daa6a6f7",
    query: req.body.query,
    results: 5,
    fields:["item_name","brand_name","nf_serving_size_qty", "nf_serving_size_unit", "nf_calories", "nf_protein", "nf_total_fat", "nf_total_carbohydrate", "images_front_full_url"],
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
    var suggestions = []
    body.hits.forEach(function(hit){
      suggestions.push({item_name: hit.fields.item_name, brand: hit.fields.brand_name})
    })
    res.json(suggestions)
  })
})

app.get('/', function(req, res){
  res.render('landing.ejs', {flash: req.flash('loginMessage')})
})

//root route
app.get('/user', function(req,res){
  res.render('index')
})

app.use('/', userRoutes)

// Connec to server
app.listen(PORT, function(){
  console.log('Server is running on port: ', PORT);
})

app.get('/auth/google',
passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/');
});
