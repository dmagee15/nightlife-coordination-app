'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var RsvpHandler = require(path + '/app/controllers/rsvpHandler.server.js');
var Users = require('../models/users.js');

module.exports = function (app, passport, yelp) {
	
/*	var newUser = new Users();
					newUser.id = 3824378232819;
					newUser.username = 'krayk333';
					newUser.displayName = 'Sam Carter';
					newUser.rsvp = ['rachels-cafe-houston','crispy-or-grilled-houston'];
					newUser.save(function (err) {
						if (err) {
							throw err;
						}console.log("SAVED USER");});*/
						
//	Users.find({'displayName':'David M'}).remove().exec();
	
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
				Users.update({'displayName':req.user.displayName},{$set: {'search':req.body.location}});
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
					adjustedData[q].votes = 0;
				}
				
				Users.find({}, function(err,allRecords){
					if(err) throw err;
					console.log("ALLRECORDS: "+allRecords);
					var allRecordsLength = (allRecords.length)?allRecords.length:1;
					var tempArray = [];
					console.log("allRecordsLength: "+allRecordsLength);
					for(var u=0;u<allRecordsLength;u++){
						for(var k=0;k<allRecords[u].rsvp.length;k++){
							tempArray.push(allRecords[u].rsvp[k]);
							console.log('Record: '+allRecords[u].rsvp[k]);
						}
					}
					var tempArrayLength = tempArray.length;
					for(var j=0;j<tempArrayLength;j++){
						for(var c=0;c<lengthSearchData;c++){
							if(adjustedData[c].id==tempArray[j]){
								adjustedData[c].votes = adjustedData[c].votes+1;
							}
						}
					}
					console.log("TEMPARRAY: "+tempArray);
					console.log("ADJUSTEDDATA: "+JSON.stringify(adjustedData[0]));
					console.log("ADJUSTEDDATA: "+adjustedData[1]);
					
					res.render('search', {
				 	results: adjustedData,
				 	raw: data,
				 	rsvp: JSON.stringify(resultArray)
				 });
					
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
