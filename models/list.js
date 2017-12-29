const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

let listSchema = mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  userID: String,
  listName: String,
  movies: [{
    type: String
}]
});

let List = module.exports = mongoose.model('List', listSchema);
