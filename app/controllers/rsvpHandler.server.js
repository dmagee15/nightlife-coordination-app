'use strict';

var Users = require('../models/users.js');

function RsvpHandler () {
   Users.find({}).remove().exec();
	this.confirmRsvp = function (req, res) {
	    var barName = req.body.value;

		Users
			.find({'displayName':req.user.displayName}).find({'rsvp':barName}, function(err,data){
				if(err){throw err;}
				if(data[0]===undefined){

					Users
					.findOneAndUpdate({'displayName':req.user.displayName}, {$push: {'rsvp': barName}}, function(err, results){
						if(err){throw err;}
                        console.log("rsvp'd "+barName+"RESULTS: "+results);
                        
                        Users.find({'displayName':req.user.displayName}, function(err, data){
			    if(err)throw err;
			    console.log("DATABEGINNING");
			    console.log(data);
			    console.log("DATAENDING");
			    res.send(data[0]);
			});
					});
				}
				else{
				    Users
					.findOneAndUpdate({'displayName':req.user.displayName}, {$pull: {'rsvp': {$in: [barName]}}}, function(err, results){
						if(err){throw err;}
                        console.log("removed rsvp "+barName+"RESULTS: "+results);
                        
                        Users.find({'displayName':req.user.displayName}, function(err, data){
			    if(err)throw err;
			    console.log("DATABEGINNING");
			    console.log(data);
			    console.log("DATAENDING");
			    res.send(data[0]);
			});
                        
					});
				}
			});
			
/*			Users.find({}, function(err, data){
			    if(err)throw err;
			    console.log("DATABEGINNING");
			    console.log(data);
			    console.log("DATAENDING");
			})*/
	};

	this.addClick = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

}

module.exports = RsvpHandler;
