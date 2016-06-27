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
  res.render('profile', {user: req.user})
})

userRouter.route('/user/:id')
  .patch(function (req, res){
    if(err) console.log(err)
User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, user){
  res.json({message: "User profile updated!", success: true, user: user})
})
  })

userRouter.get('logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter
