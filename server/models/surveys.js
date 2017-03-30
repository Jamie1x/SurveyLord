//surveys.js (database model)
//Jamie Kennedy - 300753196
//COMP308-W2017-Assignment2

let mongoose = require('mongoose');

// create a model class
let surveysSchema = mongoose.Schema({
    Title: String,
    Number: String,
    Email: String,
},
{
  collection: "surveys"
});

module.exports = mongoose.model('surveys', surveysSchema);
