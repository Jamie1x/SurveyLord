//answers.js (database model)
//Jamie Kennedy

let mongoose = require('mongoose');

// create a model class
let answersSchema = mongoose.Schema({
    SurveyID: String,
    Title: String,
    Owner: String,
    Questions: [String],
    Answers: [String]
},
{
  collection: "answers"
});

module.exports = mongoose.model('answers', answersSchema);