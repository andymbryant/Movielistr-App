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

router.post('/list', function(req, res) {
    let listID = req.body.listID;
    List.remove({"_id": listID}, function(err) {
        if (!err) {
            console.log('it worked!');
        }
    });
})

module.exports = router;
