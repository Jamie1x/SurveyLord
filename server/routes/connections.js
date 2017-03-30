//connections.js
//Jamie Kennedy - 300753196
//COMP308-W2017-Assignment2

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

// define the connection model
let connection = require('../models/connections');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET connections List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all connections in the connections collection
  connection.find((err, connections) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('connections/index', {
        title: 'Connections',
        connections: connections,
        displayName: req.user.displayName
      });
    }
  });
});

//  GET the Connection Details page in order to add a new Connection
router.get('/add', requireAuth, (req, res, next) => {
  res.render('connections/details', {
    title: "Add a new connection",
    connections: '',
    displayName: req.user.displayName
  });
});

// POST process the Connection Details page and create a new Connection - CREATE
router.post('/add', requireAuth, (req, res, next) => {
  let newConnection = connection({
    "Title": req.body.title,
    "Number": req.body.number,
    "Email": req.body.email
  });

  connection.create(newConnection, (err, connection) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/connections');
    }
  });
});

// GET the Connection Details page in order to edit an existing Connection
router.get('/:id', requireAuth, (req, res, next) => {
  try {
    // get a reference to the id from the url
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    // find one game by its id
    connection.findById(id, (err, connections) => {
      if (err) {
        console.log(err);
        res.end(error);
      } else {
        // show the connection details view
        res.render('connections/details', {
          title: 'Connection Details',
          connections: connections,
          displayName: req.user.displayName
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect('/errors/404');
  }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {
  // get a reference to the id from the url
  let id = req.params.id;

  let updatedConnection = connection({
    "_id": id,
    "Title": req.body.title,
    "Number": req.body.number,
    "Email": req.body.email
  });

  connection.update({ _id: id }, updatedConnection, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the game List
      res.redirect('/connections');
    }
  });
});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
  // get a reference to the id from the url
  let id = req.params.id;

  connection.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the connections list
      res.redirect('/connections');
    }
  });
});


module.exports = router;
