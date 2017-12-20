const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

app.post('/new-movie', (req, res) => {

    let user = new Movie({
      title: req.body.Title,
      rated: req.body.Rated,
      year: req.body.Year,
      actors: req.body.Actors,
      plot: req.body.Plot,
      runtime: req.body.Runtime,
      rotten: req.body['Ratings[1][Value]'],
      imdb: req.body['Ratings[0][Value]'],
      poster: req.body.Poster,
      id: req.body.imdbID
      //userName:
    });

    user.save( (e) => {
        console.log(e);
  });
});

module.exports = router;
