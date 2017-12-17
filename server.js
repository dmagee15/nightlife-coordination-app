'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyparser = require('body-parser');
var path = require('path');
var Yelp = require('yelp-api-v3');

var app = express();
//require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use(bodyparser.urlencoded({'extended': false}));

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var yelp = new Yelp({
  app_id: 'Q5xEsdg0B5kTGu5wm6d2AA',
  app_secret: 'uAdAPQonOBMsPA1Xy730dU7uZXElgUfT3amVV0ZTvSeLnK3jssvP4jkxjztfQ6n9'
});

routes(app, passport, yelp);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
