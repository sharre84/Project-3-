var
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  //constructor function must be capitalized
  //and it's equivalent to a class
  User = require('../models/User.js')
  //two dots because you have to go out of config and then go into models

passport.use(new GoogleStrategy({
  clientID: 1088452267193-8q2n0ncihpebaon4hidr7v5cl9ctpvsm.apps.googleusercontent.com,
  clientSecret: QEf5N-MgbZc9vCjdkMfB1Kh8,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
  function(token, tokenSecret, profile,done){
    User.findOrCreate({ googleId: profile.id}, function (err, user){
      return done(err, user);
    })
  }
));

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
