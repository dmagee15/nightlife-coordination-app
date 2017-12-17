'use strict';

var path = process.cwd();
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
		
	app.route('/guestsearch')
		.post(function(req,res){
			yelp.search({term: 'bar', location: req.body.location, price: '1,2,3', limit: 15})
			.then(function (data) {
					var adjustedData = JSON.parse(data).businesses;
				 var length = adjustedData.length;
				 for(var x=0;x<length;x++){
				 	adjustedData[x].distance = Math.floor(adjustedData[x].distance);
				 }
				 
				var lengthSearchData = adjustedData.length;
				console.log("SearchDataLength: "+lengthSearchData);
				
				for(var q=0;q<lengthSearchData;q++){
					adjustedData[q].votes = 0;
				}
				
				Users.find({}, function(err,allRecords){
					if(err) throw err;
					if(allRecords[0]==undefined){
						res.render('guestsearch', {
				 		results: adjustedData,
				 		raw: data,
				 		mapkey: process.env.GOOGLE_MAP
						});
					}
					else{
					var allRecordsLength = (allRecords.length)?allRecords.length:1;
					var tempArray = [];
					for(var u=0;u<allRecordsLength;u++){
						for(var k=0;k<allRecords[u].rsvp.length;k++){
							tempArray.push(allRecords[u].rsvp[k]);
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
					
					res.render('guestsearch', {
				 	results: adjustedData,
				 	raw: data,
				 	mapkey: process.env.GOOGLE_MAP
					});
					}
				});
				
					
					
				 
				 
				 
			})
			.catch(function (err) {
    			console.error(err);
			});	
		});
	app.route('/previoussearch')
		.get(function(req,res){
			yelp.search({term: 'bar', location: req.user.search, price: '1,2,3', limit: 15})
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
					adjustedData[q].votes = 0;
				}
				
				Users.find({}, function(err,allRecords){
					if(err) throw err;
					console.log("ALLRECORDS: "+allRecords);
					var allRecordsLength = (allRecords.length)?allRecords.length:1;
					var tempArray = [];
					for(var u=0;u<allRecordsLength;u++){
						for(var k=0;k<allRecords[u].rsvp.length;k++){
							tempArray.push(allRecords[u].rsvp[k]);
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
					
					res.render('search', {
				 	results: adjustedData,
				 	raw: data,
				 	rsvp: JSON.stringify(resultArray),
				 	user: req.user,
				 	mapkey: process.env.GOOGLE_MAP
				 });
					
				});
				
			});
					
					
				 
				 
				 
			})
			.catch(function (err) {
    			console.error(err);
			});	
		});
		
	app.route('/search')
		.post(function(req,res){
			yelp.search({term: 'bar', location: req.body.location, price: '1,2,3', limit: 15})
			.then(function (data) {
				Users.update({'displayName':req.user.displayName},{$set: {'search':req.body.location}}, function(err,main){
					if(err)throw err;
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
					for(var u=0;u<allRecordsLength;u++){
						for(var k=0;k<allRecords[u].rsvp.length;k++){
							tempArray.push(allRecords[u].rsvp[k]);
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
					
					res.render('search', {
				 	results: adjustedData,
				 	raw: data,
				 	rsvp: JSON.stringify(resultArray),
				 	user: req.user,
				 	mapkey: process.env.GOOGLE_MAP
				 });
					
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

};
