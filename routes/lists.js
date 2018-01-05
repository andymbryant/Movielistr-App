const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');


let List = require('../models/list');
let Movie = require('../models/movie');

// Mongoose connection
mongoose.connect('mongodb://heroku_n1ncd624:7ngrcj5fiib8c94e4dim03n8nj@ds229295.mlab.com:29295/heroku_n1ncd624')
var db = mongoose.connection;

// Once authenticated, return list from database and render movie-list with populated movies
router.post('/', ensureAuthenticated, function(req, res) {
    let listID = req.body.listID;
    let listNameArray = [];

    List.find(ObjectId(listID)).then(function(list) {
      let movieQueries = [];
      let movieIDArray = list[0].movies;
      listNameArray.push(list[0].listName);

      // This is an async call, so it must be wrapped in promise
      movieIDArray.forEach(function(movieID) {
        movieQueries.push(Movie.find({"id": movieID}));
      });
      return Promise.all(movieQueries);
    }).then(function(movie) {
      console.log(movie);
      res.render('movie-list', {
        movie,
        listID,
        listNameArray
      });
    })
});

// In rendered Movie-list, if user updates title it will update database
router.post('/update-title', ensureAuthenticated, function(req, res) {
  let listID = req.body.listID;
  let newTitle = req.body.newTitle
  List.findByIdAndUpdate(
    ObjectId(listID),
    {$set: { listName: newTitle}},
    {safe: true, upsert: true, new: false},
    function(err, model) {
      console.log(err);
    }
);
});

// Adds movie to list in rendered movie-list
router.post('/new-movie', ensureAuthenticated, (req, res) => {
  let listID = req.body.listID;

    // Mongoose schema
    let user = new Movie({
      title: req.body['data[Title]'],
      rated: req.body['data[Rated]'],
      year: req.body['data[Year]'],
      actors: req.body['data[Actors]'],
      plot: req.body['data[Plot]'],
      runtime: req.body['data[Runtime]'],
      rotten: req.body['data[Ratings][1][Value]'],
      imdb: req.body['data[Ratings][0][Value]'],
      poster: req.body['data[Poster]'],
      director: req.body['data[Director]'],
      id: req.body['data[imdbID]']
    });

    user.save( (e) => {
        console.log(e);
  });

  List.findByIdAndUpdate(
    ObjectId(listID),
    { $push: {movies: req.body['data[imdbID]'] }},
    {safe: true, upsert: true, new: false},
    function(err, model) {
      console.log(err);
    }
  );
});

// Add new list
router.get('/new-list', ensureAuthenticated, (req, res) => {
  let userID = req.user._id;
  List.create({ _id: ObjectId(), userID: userID, listName: 'New List' }, function (err, list) {
  if (err) {
    console.log(err);
  };
  res.send(list._id);
  })
});

router.get('/back', ensureAuthenticated, function(req, res) {
	res.send('index.html');
});


// Standard EnsureAuthenticated Function
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
};

module.exports = router;
