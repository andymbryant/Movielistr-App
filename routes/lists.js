const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var ObjectId = require('mongoose').Types.ObjectId;

 
let List = require('../models/list');
let Movie = require('../models/movie');

mongoose.connect('mongodb://localhost/recoMovie');
var db = mongoose.connection;

router.post('/', ensureAuthenticated, function(req, res) {
    let listID = req.body.listID;
    //5a3b06e6f202420444accab6
    List.find(ObjectId(listID), function(err, list) {
        for (let i = 0; i<=list[0].movies.length; i++) {
            Movie.findOne({"_id": list[0].movies[i]}, function(err, movie) {
                console.log(list[0].movies[i]);
                movieArray.push(list[0].movies[i]);
                res.render('movie-list', {
                        movie: movie
                            })
                    })
            }


        // let movie1 = list[0].movies[0];
        // let movie2 = list[0].movies[1];
        // Movie.findOne({"_id": movie1}, function(err, movie) {
        //     console.log(movie);
        //     res.render('movie-list', {
        //         movie: movie
        //     })
        // })

    });
});

router.get('/:listID', ensureAuthenticated, function(req, res) {
    res.render('movie-list', {

    })
})

router.post('/new-movie', (req, res) => {

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

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
};

module.exports = router;
