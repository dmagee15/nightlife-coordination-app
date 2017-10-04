'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
		displayName: String,
		id: Number,
		username: String,
		search:String,
		rsvp: []
});

module.exports = mongoose.model('User', User);
