//surveys.js (database model)
//Jamie Kennedy

let mongoose = require('mongoose');

// create a model class
let surveysSchema = mongoose.Schema({
    Title: String,
    Owner: String,
    Start: Date,
    Finish: Date,
    Questions: [String]
},
{
  collection: "surveys"
});

module.exports = mongoose.model('surveys', surveysSchema);
