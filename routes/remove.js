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

// Remove movie from list
router.post('/movie', function(req, res) {
    let deleteID = req.body.movieID;
    let listID = req.body.listID;
    Movie.remove({"id": deleteID}, function(err) {
        if (!err) {
            console.log('it worked!');
        }
    });

    List.findByIdAndUpdate(
        ObjectId(listID),
        { $pull: {movies: req.body.movieID }},
        {multi: true},
        function(err, model) {
            console.log(err);
        }
    );
})

// Remove list from database

router.post('/list', function(req, res) {
    let listID = req.body.listID;
    List.remove({"_id": listID}, function(err) {
        if (!err) {
            console.log('it worked!');
        }
    });
})

module.exports = router;
