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

router.post('/', ensureAuthenticated, function(req, res) {
    let listID = req.body.listID;

    List.find(ObjectId(listID), function(err, list) {
      let moviesArray = [];
      let listTitle = list[0].listName;
      async.each(list[0].movies, function(movieID) {
        moviesArray.push(movieID);
        })
        Movie.find({"id": moviesArray[0]}, function(err, movie) {
          res.render('movie-list', {
            movie: movie[0],
            listID,
            listTitle
          })
      });
    });
});

router.post('/new-list', ensureAuthenticated, function(req, res) {
  res.render()
});

router.post('/update-title', ensureAuthenticated, function(req, res) {
  let listID = req.body.listID;
  let newTitle = req.body.newTitle
  List.update(ObjectId(listID), {$set: { listName: newTitle}}, console.log('updated title in mongoose'));

  // List.find(ObjectId(listID), function(err, list) {
  //   list[0].listName = newTitle;
  //   console.log(newTitle);
  //   list[0].markModified('object');
  //   list[0].save( function (err, updatedTitle) {
  //     if (err) {
  //       console.log(err)
  //     };
  //     console.log(`this is the updated title: ${updatedTitle}`);
  //   })
  // })
});

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
