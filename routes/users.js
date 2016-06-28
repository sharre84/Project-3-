var
  express = require('express'),
  passport = require('passport'),
  User = require('../models/User.js'),
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

// userRouter.route('/update')
//   .get(function(req, res){
//     console.log(req.local);
//     res.render('update', {user: req.user})
//   })

userRouter.route('/signup')
  .get(function(req, res){
    res.render('signup', {flash: req.flash('signupMessage')})
  })
  .post(passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup'
  }))

// userRouter.get('/profile', isLoggedIn, function(req,res) {
//   res.render('profile', {user: req.user})
// })

userRouter.get('/profile', isLoggedIn, function(req, res){
    res.render('profile', {user: req.user})
})

userRouter.get('/user/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('update', {user: user})
  })
})

userRouter.post('/user/:id', function (req, res){
  console.log(req.body);
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, user){
    if(err) console.log(err)
    res.redirect('/profile')
    // res.json({message: "User profile updated!", success: true, user: user})
  //   var updateObject = req.body;
  //   var setObject = {};
  //
  //
  //   // this loops through the request object and only updates the selected keys that the user wants to update. (password changes wont work, yet)
  //   for (key in req.body) {
  //     if (key === 'id') continue;
  //     setObject['local.' + key] = req.body[key]
  //   }
  //
  //   var id = req.params.id;
  //   console.log(id);
  //   User.update({_id  : id}, {$set: setObject}, function(err, user){
  //     if (err) return console.log(err);
  //     console.log('inside of patch', user);
  //     res.json(user)
  //   });
  })
})

userRouter.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter