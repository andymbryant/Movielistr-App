const mongoose = require('mongoose');

let listSchema = mongoose.Schema({
  _id: String,
  userID: String,
  listName: String,
  movies: [{
    type: String
}]
});

let List = module.exports = mongoose.model('List', listSchema);
