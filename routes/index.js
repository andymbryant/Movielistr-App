const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const mongoose = require('mongoose');

let Movie = require('../models/movie');
let List = require('../models/list')

mongoose.connect('mongodb://localhost/recoMovie');
var db = mongoose.connection;
// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	let userID = req.user._id;
	List.find({"userID": userID}, function(err, lists) {
		res.render('dashboard', {
			lists,
	});

});
	//grab current user's lists
	//send those lists to dashboard
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;
