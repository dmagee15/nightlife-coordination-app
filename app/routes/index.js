'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var RsvpHandler = require(path + '/app/controllers/rsvpHandler.server.js');
var Users = require('../models/users.js');

module.exports = function (app, passport, yelp) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	var rsvpHandler = new RsvpHandler();
	
	app.route('/')
		.get(function (req, res) {
			console.log(req.user);
			res.render('homepage', {
				user: req.user
			});
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});
		
	app.route('/search')
		.post(function(req,res){
			yelp.search({term: 'food', location: req.body.location, price: '1,2,3', limit: 15})
			.then(function (data) {
				 var adjustedData = JSON.parse(data).businesses;
				 var length = adjustedData.length;
				 for(var x=0;x<length;x++){
				 	adjustedData[x].distance = Math.floor(adjustedData[x].distance);
				 }
				 
			var resultArray = [];
			Users
			.find({'displayName':req.user.displayName}, function(err,mondata){
				if(err)throw err;
				console.log("MONGOOSE: "+mondata[0].rsvp);
				length = mondata[0].rsvp.length;
				var lengthSearchData = adjustedData.length;
				console.log("SearchDataLength: "+lengthSearchData);

				for(var y=0;y<lengthSearchData;y++){
					resultArray.push(false);
					for(var x=0;x<length;x++){
						if(mondata[0].rsvp[x]==adjustedData[y].id){
							resultArray[y] = true;
						}
					}
				}
				
				for(var q=0;q<lengthSearchData;q++){
					adjustedData[q].rsvpflag = resultArray[q];
				}
				
				
				res.render('search', {
				 	results: adjustedData,
				 	raw: data,
				 	rsvp: JSON.stringify(resultArray)
				 });
			});
				 
				 
			})
			.catch(function (err) {
    			console.error(err);
			});	
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/google')
		.get(passport.authenticate('google', { scope: ['profile'] }));

	app.route('/oauth2callback')
		.get(passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	app.route('/confirmRsvp')
		.post(isLoggedIn, rsvpHandler.confirmRsvp);

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
