var
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
User = require('../models/User.js')

passport.use(new GoogleStrategy({
  clientID: "1088452267193-8q2n0ncihpebaon4hidr7v5cl9ctpvsm.apps.googleusercontent.com",
  clientSecret: "QEf5N-MgbZc9vCjdkMfB1Kh8",
  callbackURL: "https://mighty-inlet-45127.herokuapp.com/auth/google/callback"
},
function(token, tokenSecret, profile, done){
  console.log("Inside of GoogleStrategy");
  process.nextTick(function(){
    User.findOne({ googleId: profile.id}, function (err, user) {
      if (err)
      return done(err, user);
      if (user) {
        console.log("user found");
        console.log(user);
        return done(null, user);
      }
      else {
        console.log("user not found, creating one");
        var newUser = new User();
        newUser.google.id = profile.id;
        newUser.google.token = token;
        newUser.google.name = profile.displayName;
        newUser.google.email = profile.emails[0].value;
        console.log(profile);
        console.log(token);
        newUser.save(function(err) {
          if (err)
          throw err;
          return done(null,newUser);
        });
      }
    });
  });
}));

passport.serializeUser(function(user, done){
  //create cookie
  done(null, user.id)
  //similar to next in middle ware, but it also handles error.  Kinda like
  //go on to the next thing but don't use cookie
})

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user)
  })
})

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  //what are we logging in with? email!
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  //function for checking if email is used, password
  User.findOne({'local.email': email}, function(err, user){
    //looking for user's email within the local email
    if(err) return done(err)
    if(user) return done(null, false, req.flash('signupmessage', 'That email is taken.'))
    var newUser = new User()
    newUser.local.name = req.body.name
    newUser.local.email = email
    newUser.local.password = newUser.generateHash(password)
    newUser.save(function(err){
      if(err) return console.log(err)
      return done(null, newUser, null)
    })
  })
}))

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  User.findOne({'local.email': email}, function(err, user){
    if(err) return done(err)
    if(!user) return done(null, false, req.flash('loginMessage', 'No user found...'))
    if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong password...'))
    return done(null, user)
  })
}))

module.exports = passport
