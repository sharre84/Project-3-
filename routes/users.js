var
  express = require('express'),
  passport = require('passport'),
  userRouter = express.Router()

userRouter.route('/login')
  .get(function(req, res){
    res.render('login', {flash: req.flash('loginMessage')})
    //simply render the login view
  })
  .post(passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login'
  }))


userRouter.route('/signup')
  .get(function(req, res){
    res.render('signup', {flash: req.flash('signupMessage')})
  })
  .post(passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup'
  }))

userRouter.get('/profile', isLoggedIn, function(req,res) {
  //before someone goes into the profile, run isLoggedIn before the function
  //render the user's profile view (only if they're logged in...)
  //cookie will be the deciding factor for which user to show, so no need id
  res.render('profile', {user: req.user})
})

userRouter.get('logout', function(req, res) {
  //destroy the session, and redirect the user back to the home page...
  req.logout()
  res.redirect('/')
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter
