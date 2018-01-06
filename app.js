const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

var app = express();

//Mongoose
mongoose.connect('mongodb://heroku_n1ncd624:7ngrcj5fiib8c94e4dim03n8nj@ds229295.mlab.com:29295/heroku_n1ncd624');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Mongoose is connected');
});

mongoose.Promise = global.Promise;

//Routes
var routes = require('./routes/index');
var users = require('./routes/users');
var lists = require('./routes/lists');
var remove = require('./routes/remove');

//Use Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

//use Passport
app.use(passport.initialize());
app.use(passport.session());

//use Flash
app.use(flash());

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Express middleware
app.use('/', routes);
app.use('/users', users);
app.use('/lists', lists);
app.use('/remove', remove);

//Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('Server started on port '+app.get('port'));
});

//Export module
module.exports = app
