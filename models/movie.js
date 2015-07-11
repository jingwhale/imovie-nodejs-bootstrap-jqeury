var mongoose = require('mongoose');
var movieSchema = require('../schema/movie');
var movie = mongoose.model('movie', movieSchema);

module.exports = movie;
