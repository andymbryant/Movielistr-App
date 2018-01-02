const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  title: String,
  rated: String,
  year: String,
  actors: String,
  plot: String,
  runtime: String,
  rotten: String,
  imdb: String,
  poster: String,
  director: String,
  id: String

  // userName: String,
});

let Movie = module.exports = mongoose.model('Movie', movieSchema);
