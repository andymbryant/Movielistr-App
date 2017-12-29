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

mongoose.connect('mongodb://localhost/recoMovie');
var db = mongoose.connection;

// router.post('/', ensureAuthenticated, function(req, res) {
//     let listID = req.body.listID;
//
//     List.find(ObjectId(listID), function(err, list) {
//       let moviesArray = [];
//       let listTitle = list[0].listName;
//       async.each(list[0].movies, function(movieID) {
//         moviesArray.push(movieID);
//         })
//         Movie.find({"id": moviesArray[0]}, function(err, movie) {
//           res.render('movie-list', {
//             movie: movie[0],
//             listID,
//             listTitle
//           })
//       });
//     });
// }); 

router.post('/', ensureAuthenticated, function(req, res) {
    let listID = req.body.listID;
    let listNameArray = [];

    List.find(ObjectId(listID)).then(function(list) {
      let movieQueries = [];
      let movieIDArray = list[0].movies;
      listNameArray.push(list[0].listName);

      movieIDArray.forEach(function(movieID) {
        movieQueries.push(Movie.find({"id": movieID}));
      });
      return Promise.all(movieQueries);
    }).then(function(movie) {
      res.render('movie-list', {
        movie,
        listID,
        listNameArray
      });
    })
});

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

router.post('/new-movie', ensureAuthenticated, (req, res) => {
  let listID = req.body.listID;

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
	res.redirect('back');
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
};

module.exports = router;
