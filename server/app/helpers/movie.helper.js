const Movies = require("../models/movies.model")
const request = require("request");

// Prepare movies from YTS API
const			prepareMoviesAPIV1 = async ( items, userid ) =>
	items.map( async (item) => {
		return {
			id: item.id,
			title: item.title,
			year: item.year,
			rating: item.rating,
			image: item.large_cover_image,
			watched: ( await Movies.findOne({ 'movieId': item.id, 'userId': userid, 'type': "watch" }) ) ? true : false
		}
	});

// Prepare movies from apiumadomain API
const			prepareMoviesAPIV2 = async ( items, userid ) =>
	items.map( async (item) => {
		return {
			id: item.id,
			title: item.title,
			year: item.year,
			rating: item.rating,
			image: item.poster_big,
			watched: ( await Movies.findOne({ 'movieId': item.id, 'userId': userid, 'type': "watch" }) ) ? true : false
		}
	});

// Prepare movie details form YTS API
const			prepareMovieDetailsV1 = async ( movie, userid ) => {
	return {
		id: movie.id,
		imdb: movie.imdb_code,
		title: movie.title,
		title_long: movie.title_long,
		descripton: movie.description_intro,
		year: movie.year,
		rating: movie.rating,
		runtime: movie.runtime,
		genres: movie.genres,
		actors: (movie.cast) ? movie.cast.map((item) => item.name ).join(", ") : "",
		image: movie.large_cover_image,
		torrents: movie.torrents
		.sort((a, b) => a.seeds > b.seeds ? -1 : (a.seeds < b.seeds ? 1 : 0) )
		// .filter((item) => { if ( item.seeds !== 0 ) return item })
		.filter((value, index, arr) => arr.findIndex( t => ( t.quality === value.quality ) ) === index )
		.map((item) => {
			return {
				quality: item.quality,
				hash: item.hash
			}
		}),
		favorite: ( await Movies.findOne({ 'movieId': movie.id, 'userId': userid, 'type': "favorite" }) ) ? true : false
	}
}

//  Prepare movie details from apiumadomain API
const			prepareMovieDetailsV2 = async ( movie, userid ) => {
	return {
		id: movie.id,
		imdb: movie.imdb,
		title: movie.title,
		descripton: movie.description,
		year: movie.year,
		rating: movie.rating,
		runtime: movie.runtime,
		genres: movie.genres,
		actors: movie.actors,
		image: movie.poster_big,
		torrents: movie.items
		.sort((a, b) => a.torrent_seeds > b.torrent_seeds ? -1 : (a.torrent_seeds < b.torrent_seeds ? 1 : 0) )
		// .filter((item) => { if ( item.torrent_seeds !== 0 ) return item })
		.filter((value, index, arr) => arr.findIndex( t => ( t.quality === value.quality ) ) === index )
		.map((item) => {
			return {
				quality: item.quality,
				hash: item.id
			}
		}),
		favorite: ( await Movies.findOne({ 'movieId': movie.id, 'userId': userid, 'type': "favorite" }) ) ? true : false
	}
}

const			prepareMoviesSuggestions = ( movies ) => movies.map((item) => { return { id: item.id, title: item.title_long, rating: item.rating, image: item.medium_cover_image } } )

const			loadMoviesAPI1 = async ( options, userid ) => {
	return new Promise( async (resolve, reject) => {
		try {
			request(`
				${ process.env.API_MOVIES_V1 }?limit=${ options.limit }&page=${ options.page }&genre=${ options.filter.genre }&minimum_rating=${ options.filter.rating }&quality=${ options.filter.quality }&sort_by=${ options.sort }&query_term=${ options.search }`,
				async ( error, response, body ) => {
					if ( error || response.statusCode !== 200 ) {
						reject( new Error( "Can't load movies list !" ) );
					} else {
						const data = JSON.parse( body );
						const dataMovies = ( typeof data.data.movies == "undefined" || !data.data.movies ) ? [] : data.data.movies;
						moviesAPI1 = dataMovies.filter((value, index, arr) => arr.findIndex( t => ( t.id === value.id ) ) === index );
						Promise.all( await prepareMoviesAPIV1( moviesAPI1, userid ) ).then((result) => resolve( result ) )
					}
				}
			);
		} catch ( e ) {
			reject( new Error( "Failed to load movies list, try later !" ) );
		}
	});
}
const			loadMoviesAPI2 = async ( options, userid ) => {
	return new Promise((resolve, reject) => {
		try {
			request(`
				${ process.env.API_MOVIES_V2 }?limit=${ options.limit }&page=${ options.page }&genre=${ options.filter.genre }&quality=${ options.filter.quality }&sort=${ (options.sort) == "like_count" ? "seeds" : options.sort }&keywords=${ options.search }`,
				async ( error, response, body ) => {
					if ( error || response.statusCode !== 200 ) {
						reject( new Error( "Can't load movies list !" ) );
					} else {
						const data = JSON.parse( body );
						const dataMovies = ( typeof data.MovieList == "undefined" || !data.MovieList ) ? [] : data.MovieList;
						moviesAPI2 = dataMovies.filter((value, index, arr) => arr.findIndex( t => ( t.id === value.id ) ) === index );
						Promise.all( await prepareMoviesAPIV2( moviesAPI2, userid ) ).then((result) => resolve( result ) )
					}
				}
			);
		} catch ( e ) {
			reject( new Error("Failed to load movies list, try later !") );
		}
	});
}

const			loadMovieInfosV1 = async ( id, userID ) => {
	return new Promise( async (resolve, reject) => {
		try {
			request(`${ process.env.API_MOVIE_DETAILS_V1 }?movie_id=${ id }&with_images=true&with_cast=true`,
				async ( error, response, body ) => {
					if ( error || response.statusCode !== 200 ) {
						reject( new Error( "Failed to get movie details !" ) );
					} else {
						const parsedData = JSON.parse( body );
						resolve( ( typeof parsedData.data.movie == "undefined" || !parsedData.data.movie || parsedData.data.movie.id === 0 ) ? null : await prepareMovieDetailsV1( parsedData.data.movie, userID ) );
					}
				}
			);
		} catch ( e ) {
			reject( new Error("Failed to load movie details, try later !") );
		}
	});
}

const			loadMovieInfosV2 = async ( id, userid ) => {
	return new Promise( async (resolve, reject) => {
		try {
			request(`${ process.env.API_MOVIES_V2 }?keywords=${ id }`,
				async ( error, response, body ) => {
					if ( error || response.statusCode !== 200 ) {
						reject( new Error( "Failed to get movie details !" ) );
					} else {
						const parsedData = JSON.parse( body );
						resolve( ( typeof parsedData.MovieList == "undefined" || !parsedData.MovieList || parsedData.MovieList.id === 0 ) ? null : await prepareMovieDetailsV2(parsedData.MovieList[0], userid) );
					}
				}
			);
		} catch ( e ) {
			reject( new Error("Failed to load movie details, try later !") );
		}
	});
}

exports.loadMoviesList = async ( options, userid ) => {
	return new Promise( async (resolve, reject) => {
		try {
			await loadMoviesAPI1( options, userid )
			.then( async (moviesAPI1) => {
				if ( moviesAPI1.length === 0 ) await loadMoviesAPI2( options, userid ).then((moviesAPI2) => resolve( moviesAPI2 ) ).catch((error) => reject( error.message ) );
				else resolve( moviesAPI1 );
			})
			.catch((error) => { reject( error.message ) });
		} catch ( e ) {
			reject( new Error( "Failed to load movies list !" ) );
		}
	});
}

exports.loadMovieDetails = async ( movieID, userID ) => {
	return new Promise( async (resolve, reject) => {
		try {
			await loadMovieInfosV1( movieID, userID )
			.then( async (movieV1) => {
				if ( movieV1 ) resolve( movieV1 );
				else await loadMovieInfosV2( movieID, userID ).then((movieV2) => resolve( movieV2 ) ).catch((error) => reject( error ));
			})
			.catch((error) => reject( error ));
		} catch ( e ) {
			reject( new Error( "Failed to get movie details !" ));
		}
	});
}

exports.loadSuggestionsMovie = async ( movieID ) => {
	return new Promise((resolve, reject) => {
		try {
			request(`${ process.env.API_MOVIE_SUGGESTIONS_V1 }?movie_id=${ movieID }`,
				( error, response, body ) => {
					if ( error || response.statusCode !== 200 ) {
						reject( new Error( "Failed to get suggestions lists !" ) );
					} else {
						const parsedData = JSON.parse( body );
						resolve( ( typeof parsedData.data.movies == "undefined" || !parsedData.data.movies ) ? [] : prepareMoviesSuggestions( parsedData.data.movies ) );
					}
				}
			)
		} catch ( e ) {
			reject( new Error( "Failed to get suggestions lists !" ));
		}
	});
}