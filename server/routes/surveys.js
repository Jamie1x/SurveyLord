//surveys.js
//Jamie Kennedy - 300753196
//COMP308-W2017-Final

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the database models
let survey = require('../models/surveys');
let answer = require('../models/answers');
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

let date = new Date();

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET surveys List page. READ */
router.get('/', (req, res, next) => {
  // find all surveys in the surveys collection
  survey.find((err, surveys) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('surveys/index', {
        title: 'Surveys',
        surveys: surveys,
        date: date,
        displayName: req.user ? req.user.displayName : '',
        username: req.user ? req.user.username : ''
      });
    }
  });
});

//  GET the Survey Details page in order to add a new Survey
router.get('/add', requireAuth, (req, res, next) => {
  res.render('surveys/details', {
    title: "Add a new survey",
    surveys: '',
    displayName: req.user.displayName,
    username: req.user ? req.user.username : ''
  });
});

// POST process the Survey Details page and create a new Survey - CREATE
router.post('/add', requireAuth, (req, res, next) => {
  let newSurvey = survey({
    "Title": req.body.title,
    "Owner": req.user.username,
    "Start": req.body.start,
    "Finish": req.body.finish,
    "Questions": req.body.question
  });

  survey.create(newSurvey, (err, survey) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/surveys');
    }
  });
});

// GET the Survey Answer page in order to answer an existing Survey
router.get('/:id', (req, res, next) => {
  try {
    // get a reference to the id from the url
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    // find one game by its id
    survey.findById(id, (err, surveys) => {
      if (err) {
        console.log(err);
        res.end(error);
      } else {
        // show the survey details view
        res.render('surveys/answer', {
          title: 'Survey',
          surveys: surveys,
          displayName: req.user ? req.user.displayName : '',
          username: req.user ? req.user.username : ''
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect('/errors/404');
  }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  try {
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    survey.findById(id, (err, surveys) => {
      if (err) {
        console.log(err);
        res.end(error);
      } else {
        let newAnswer = answer({
          "SurveyID": id,
          "Title": surveys.Title,
          "Owner": surveys.Owner,
          "Questions": surveys.Questions,
          "Answers": req.body.answer
        });

        answer.create(newAnswer, (err, answer) => {
          if (err) {
            console.log(err);
            res.end(err);
          } else {
            res.redirect('/surveys');
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect('/errors/404');
  }
});

router.get('/:id/results', requireAuth, (req, res, next) => {
  try {
    // get a reference to the id from the url
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    answer.find({SurveyID: id}, (err, answers) => {
      if (err) {
        console.log(err);
        res.end(error);
      } else {
        // show the survey details view
        res.render('surveys/results', {
          title: 'Answers',
          surveyid: id,
          answers: answers,
          displayName: req.user ? req.user.displayName : '',
          username: req.user ? req.user.username : ''
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect('/errors/404');
  }
});

router.get('/:id/results/:answerid', requireAuth, (req, res, next) => {
  try {
    // get a reference to the id from the url
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    let answerid = mongoose.Types.ObjectId.createFromHexString(req.params.answerid);

    answer.findById(answerid, (err, answers) => {
      if (err) {
        console.log(err);
        res.end(error);
      } else {
        // show the survey details view
        res.render('surveys/view', {
          title: 'Full Results',
          answers: answers,
          displayName: req.user ? req.user.displayName : '',
          username: req.user ? req.user.username : ''
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect('/errors/404');
  }
});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
  // get a reference to the id from the url
  let id = req.params.id;

  survey.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the surveys list
      res.redirect('/surveys');
    }
  });
});

module.exports = router;
