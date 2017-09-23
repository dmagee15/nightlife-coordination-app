'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport, yelp) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(function (req, res) {
			res.render('homepage');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});
		
	app.route('/search')
		.post(function(req,res){
			yelp.search({term: 'food', location: req.body.location, price: '1,2,3', limit: 15})
			.then(function (data) {
				 console.log(JSON.parse(data).businesses[0]);
				 var adjustedData = JSON.parse(data).businesses;
				 var length = adjustedData.length;
				 for(var x=0;x<length;x++){
				 	adjustedData[x].distance = Math.floor(adjustedData[x].distance);
				 }
				 res.render('search', {
				 	results: adjustedData
				 });
			})
			.catch(function (err) {
    			console.error(err);
			});	
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
