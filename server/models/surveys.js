//surveys.js (database model)
//Jamie Kennedy - 300753196
//COMP308-W2017-Final

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
