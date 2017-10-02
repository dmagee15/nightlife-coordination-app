'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
		displayName: String,
		username: String,
		rsvp: []
});

module.exports = mongoose.model('User', User);
