const Movies = require("../models/movies.model");

exports.isMovieIdValid = async ( req, res, next ) => {
	try {
		const id = parseInt(req.params.id);
		
		if ( isNaN( id ) ) return res.status(400).json({ success: false, error: "Invalid movie id !" });
		else next();
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while validate the specified movie, try later !"
		});
	}
}

exports.addFavoriteMovie = async ( req, res, next ) => {
	const { movieId } = req.body;

	try {
		await Movies.findOne({ $and: [ { 'movieId': movieId }, { 'type': "favorite" } ] })
		.then((favorite) => {
			if ( favorite ) return res.status( 400 ).json({ success: false, error: "Already exists in favorite lists !" });
			else next();
		});
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while validate the specified favorite movie, try later !"
		});
	}
}

exports.addWatchedMovie = async ( req, res, next ) => {
	const { movieId } = req.body;

	try {
		await Movies.findOne({ $and: [ { 'movieId': movieId }, { 'type': "watch" } ] })
		.then((watched) => {
			if ( watched ) return res.status( 200 ).json({});
			else next();
		});
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while validate the specified watched movie, try later !"
		});
	}
}

exports.deleteFavoriteMovie = async ( req, res, next ) => {
	const movieId = req.params.movieid;
	const userid = req.user._id;

	try {
		await Movies.findOne({ $and: [ { 'movieId': movieId }, { 'userId': userid }, { 'type': "favorite" } ] })
		.then((movie) => {
			if ( !movie ) return res.status( 400 ).json({ success: false, error: "The specified movie not in favorite list yet !" });
			else next();
		});
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while validate the specified movie, try later !"
		});
	}
}