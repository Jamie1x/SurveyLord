//index.js
//Jamie Kennedy

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

// define the game model
let survey = require('../models/surveys');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    surveys: '',
    displayName: req.user ? req.user.displayName : '',
    username: req.user ? req.user.username : ''
  });
});

// GET /login - render the login view
router.get('/login', (req, res, next) => {
  // check to see if the user is not already logged in
  if (!req.user) {
    // render the login page
    res.render('auth/login', {
      title: "Login",
      surveys: '',
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : '',
      username: req.user ? req.user.username : ''
    });
    return;
  } else {
    return res.redirect('/surveys'); // redirect to surveys list
  }
});

// POST /login - process the login attempt
router.post('/login', passport.authenticate('local', {
  successRedirect: '/surveys',
  failureRedirect: '/login',
  failureFlash: 'bad login'
}));

// GET /register - render the registration view
router.get('/register', (req, res, next) => {
  // check to see if the user is not already logged in
  if (!req.user) {
    // render the registration page
    res.render('auth/register', {
      title: "Register",
      surveys: '',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : '',
      username: req.user ? req.user.username : ''
    });
    return;
  } else {
    return res.redirect('/surveys'); // redirect to surveys list
  }
});

// POST / register - process the registration submission
router.post('/register', (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
      displayName: req.body.displayName
    }),
    req.body.password,
    (err) => {
      if (err) {
        console.log('Error inserting new user');
        if (err.name == "UserExistsError") {
          req.flash('registerMessage', 'Registration Error: User Already Exists');
        }
        return res.render('auth/register', {
          title: "Register",
          surveys: '',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
        });
      }
      // if registration is successful
      return passport.authenticate('local')(req, res, () => {
        res.redirect('/surveys');
      });
    });
});

//GET /profile - render the user profile view
router.get('/profile', requireAuth, (req, res, next) => {
  survey.find((err, surveys) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('content/profile', {
        title: req.user.username,
        surveys: surveys,
        displayName: req.user ? req.user.displayName : '',
        username: req.user ? req.user.username : '',
        email: req.user ? req.user.email : ''
      });
    }
  });
});

router.get('/profile/edit', requireAuth, (req, res, next) => {
  // show the survey details view
  res.render('content/editProfile', {
    title: 'Edit Profile',
    surveys: '',
    displayName: req.user ? req.user.displayName : '',
    username: req.user ? req.user.username : '',
    email: req.user ? req.user.email : ''
  });
});

//POST / profile/edit - update user information
router.post('/profile/edit', requireAuth, (req, res, next) => {
  let userName = req.user.username;

  let updatedUser = new User({
    "_id": req.user._id,
    "username": userName,
    "email": req.body.email,
    "displayName": req.body.displayName
  });
  User.update({username: userName}, updatedUser, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // return to profile
      res.redirect('/profile');
    }
  });
});

// GET /logout - process the logout request
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/'); // redirect to the home page
});
module.exports = router;
