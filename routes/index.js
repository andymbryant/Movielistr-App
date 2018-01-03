const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const mongoose = require('mongoose');

let Movie = require('../models/movie');
let List = require('../models/list')

mongoose.connect('mongodb://heroku_n1ncd624:7ngrcj5fiib8c94e4dim03n8nj@ds229295.mlab.com:29295/heroku_n1ncd624')
var db = mongoose.connection;

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	let listFound = [];
	let firstName = req.user.name;
	let userID = req.user._id;
	List.find({"userID": userID}, function(err, lists) {
		if (lists) {
			listFound.push(lists);
		}
		res.render('dashboard', {
			lists,
			firstName,
			listFound,
		});
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		console.log('not authorized');
		res.redirect('/users/login');
	}
}

module.exports = router;
