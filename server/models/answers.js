//answers.js (database model)
//Jamie Kennedy - 300753196
//COMP308-W2017-Final

let mongoose = require('mongoose');

// create a model class
let answersSchema = mongoose.Schema({
    Title: String,
    Owner: String,
    Answer: [String]
},
{
  collection: "answers"
});

module.exports = mongoose.model('answers', answersSchema);