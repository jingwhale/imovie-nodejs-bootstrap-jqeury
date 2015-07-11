var express = require('express');
var mongoose = require('mongoose');
var underscore = require('underscore');
var movie = require('./models/movie');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imovie');
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser()); //overtime
app.use(require('body-parser').urlencoded({extended: true}));
app.locals.moment = require('moment');
app.listen(port);

console.log('app start on port ' + port);

// index page
app.get('/', function(req, res) {
	movie.fetch(function(err, movies) {
		if(err) {
			console.log(err);
		}
		res.render('index', {
			title:'iMovie 首页',
			movies: movies
		});
	});
});

// detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id;

	movie.findById(id, function(err, movie) {
		res.render('detail', {
			title: 'iMovie 影片详情页：' + movie.title,
			movie: movie
		});
	})
});

//admin update movie
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id;
	if(id) {
		movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'iMovie 后台更新',
				movie: movie
			});
		});
	}
});

//admin post movie
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	// console.log(typeof id);
	// console.log(movieObj);
	var _movie;

	if(id !== undefined && id !== 'undefined') {
		movie.findById(id, function(err, movie) {
			if(err) {
				console.log(err);
			}
			_movie = underscore.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if(err) {
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			});
		});
	}
	else {
		_movie = new movie({
				director: movieObj.director,
				title: movieObj.title,
				language: movieObj.language,
				country: movieObj.country,
				summary: movieObj.summary,
				flash: movieObj.flash,
				poster: movieObj.poster,
				year: movieObj.year
		});
		_movie.save(function(err, movie) {
				if(err) {
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			});
	}
})

// list page
app.get('/admin/list', function(req, res) {
	movie.fetch(function(err, movies) {
		if(err) {
			console.log(err);
		}
		res.render('list', {
			title:'iMovie 后台-影片列表',
			movies: movies
		});
	});
});


//list delete
app.delete('/admin/list', function(req, res) {
	var id = req.query.id;

	if(id) {
		movie.remove({_id: id}, function(err, movie) {
			if(err) {
				console.log(err);
			}
			else {
				res.json({success: 1});
			}
		})
	}
})


// admin page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title:'iMovie 后台管理',
		movie: {
			title: ' ',
			director: ' ',
			country: ' ',
			year: ' ',
			language: ' ',
			summary: ' ',
			poster: ' ',
			flash: ' '
		}
	});
});