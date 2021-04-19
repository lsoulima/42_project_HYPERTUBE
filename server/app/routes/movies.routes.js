/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: 'http'
 *       scheme: 'bearer'
 *       bearerFormat: 'JWT'
 *
 * tags:
 *   name: Movies
 *   description: All about /api/movies
 */

const moviesController = require("../controllers/movies.controller");
const moviesMiddlewares = require("../middlewares/movies.middlewares");
const routes = require('express').Router();

module.exports = ( passport ) => {
	const AuthMiddlewares = require('../middlewares/auth.middlewares')(passport);

    return routes
    .get("/list", AuthMiddlewares.isAuth, moviesController.getList)
    .get("/id/:id", AuthMiddlewares.isAuth, moviesMiddlewares.isMovieIdValid, moviesController.getMovie)
    .get("/suggestions/id/:id", AuthMiddlewares.isAuth, moviesMiddlewares.isMovieIdValid, moviesController.getMovieSuggestions)
    .get("/favorite", AuthMiddlewares.isAuth, moviesController.getFavoriteList)
    .get("/watched", AuthMiddlewares.isAuth, moviesController.getWatchedList)
    .get("/stream/:hash", moviesController.streamHandler )
    .get("/subtitles/:imdb", moviesController.subtitlesHandler )
    .post("/add/tofavorite", AuthMiddlewares.isAuth, moviesMiddlewares.addFavoriteMovie, moviesController.addFavoriteMovie )
    .post("/add/towatch", AuthMiddlewares.isAuth, moviesMiddlewares.addWatchedMovie, moviesController.addWatchedMovie )
    .delete("/delete/fromfavorite/:movieid", AuthMiddlewares.isAuth, moviesMiddlewares.deleteFavoriteMovie, moviesController.deleteFromFavoriteList )
}

/**
 * @swagger
 *
 * /api/movies/list:
 *   get:
 *     summary: Load movies list
 *     description: Get movies list and there informations
 *     tags:
 *       - Movies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Movie id
 *                   title:
 *                     type: string
 *                     description: Movie title
 *                   year:
 *                     type: integer
 *                     description: Movie year
 *                   rating:
 *                     type: integer
 *                     format: double
 *                     description: Movie rating
 *                   image:
 *                     type: string
 *                     description: Movie image
 *               example:
 *                 - id: 13106
 *                   title: "Avengers: Endgame"
 *                   year: 2019
 *                   rating: 8.4
 *                   image: "https://yts.mx/assets/images/movies/avengers_endgame_2019/large-cover.jpg"
 *                 
 *                 - id: 8462
 *                   title: "Avengers: Infinity War"
 *                   year: 2018
 *                   rating: 8.4
 *                   image: "https://yts.mx/assets/images/movies/avengers_infinity_war_2018/large-cover.jpg"
 *                 
 *                 - id: 1606
 *                   title: "Inception"
 *                   year: 2010
 *                   rating: 8.8
 *                   image: "https://yts.mx/assets/images/movies/Inception_2010/large-cover.jpg"
 *   
 *       400:
 *         description: Bad request, Failed to load movies list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to load movies list !"
 * 
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 * 
 */

/**
 * @swagger
 *
 * /api/movies/id/{id}:
 *   get:
 *     summary: Get details of a movie by id
 *     description: Get informations about a movie
 *     tags:
 *       - Movies
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: 30219
 *                 imdb: "tt0050171"
 *                 title: "Battle Hymn"
 *                 title_long: "Battle Hymn (1957)"
 *                 descripton: "Dean Hess, who entered the ministry to atone for bombing a German orphanage, decides he's a failure at preaching. Rejoined to train pilots early in the Korean War, he finds Korean orphans raiding the airbase garbage. With a pretty Korean teacher, he sets up an orphanage for them and others. But he finds that to protect his charges, he has to kill."
 *                 year: 1957
 *                 rating: 6.4
 *                 runtime: 108
 *                 genres:
 *                   - "Biography"
 *                   - "Drama"
 *                   - "History"
 *                   - "War"
 *                 actors: "James Hong, Don DeFore, Jock Mahoney, Rock Hudson"
 *                 image: "https://yts.mx/assets/images/movies/battle_hymn_1957/large-cover.jpg"
 *                 torrents:
 *                   - quality: "720p"
 *                     hash: "D6BCC7C395B7C298E0578B9A7051D7671ADFE35A"
 *                     magnet: "magnet:?xt=urn:btih:D6BCC7C395B7C298E0578B9A7051D7671ADFE35A&dn=Battle Hymn (1957).720p&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.coppersurfer.tk:6969"
 *                   - quality: "1080p"
 *                     hash: "824C9F6F0485437BDD2372489D16B684A2197494"
 *                     magnet: "magnet:?xt=urn:btih:824C9F6F0485437BDD2372489D16B684A2197494&dn=Battle Hymn (1957).1080p&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.openbittorrent.com:80"
 *       400:
 *         description: Bad request, Failed to load details movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to get movie details !"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 * 
 */

/**
 * @swagger
 *
 * /api/movies/suggestions/id/{id}:
 *   get:
 *     summary: Get suggestions list of a movie by id
 *     description: Get movies suggestions
 *     tags:
 *       - Movies
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Movie id
 *                   title:
 *                     type: string
 *                     description: Movie title
 *                   rating:
 *                     type: integer
 *                     format: double
 *                     description: Movie rating
 *                   image:
 *                     type: string
 *                     description: Movie image
 *               example:
 *                 - id: 415
 *                   title: "Becket (1964)"
 *                   rating: 7.8
 *                   image: "https://yts.mx/assets/images/movies/becket_1964/medium-cover.jpg"
 *                 - id: 3725
 *                   title: "The Snowtown Murders (2011)"
 *                   rating: 6.6
 *                   image: "https://yts.mx/assets/images/movies/Snowtown_2011/medium-cover.jpg"
 *                 - id: 24855
 *                   title: "#O2LForever (2015)"
 *                   rating: 8.6
 *                   image: "https://yts.mx/assets/images/movies/o2lforever_2015/medium-cover.jpg"
 *                 - id: 28863
 *                   title: "The Notorious Bettie Page (2005)"
 *                   rating: 6.5
 *                   image: "https://yts.mx/assets/images/movies/the_notorious_bettie_page_2005/medium-cover.jpg"
 *       400:
 *         description: Bad request, Failed to load suggestions list of a movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to get suggestions lists !"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 * 
 */

/**
 * @swagger
 *
 * /api/movies/favorite:
 *   get:
 *     summary: Load favorite movies
 *     description: Get favorite movies list
 *     tags:
 *       - Movies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Movie id
 *                   title:
 *                     type: string
 *                     description: Movie title
 *                   year:
 *                     type: integer
 *                     description: Movie year
 *                   rating:
 *                     type: integer
 *                     format: double
 *                     description: Movie rating
 *                   image:
 *                     type: string
 *                     description: Movie image
 *               example:
 *                 - _id: "60742346a7cf0642ae2b61cc"
 *                   userId: "60706364f94bee11d74e9acf"
 *                   movieId: "30219"
 *                   title: "Battle Hymn (1957)"
 *                   year: 1957
 *                   image: "https://yts.mx/assets/images/movies/battle_hymn_1957/large-cover.jpg"
 *                   rating: 6.4
 *                   type: "favorite"
 *                 - _id: "60742346a7cf0642ae2b61bb"
 *                   movieId: "30220"
 *                   userId: "60706364f94bee11d74e9acf"
 *                   title: "Avengers: Endgame"
 *                   year: 2019
 *                   rating: 8.4
 *                   image: "https://yts.mx/assets/images/movies/avengers_endgame_2019/large-cover.jpg"
 *                   type: "favorite"
 *   
 *       400:
 *         description: Bad request, Failed to load favorite movies list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to load favorites list !"
 * 
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 * 
 */

/**
 * @swagger
 *
 * /api/movies/watched:
 *   get:
 *     summary: Load watched movies list
 *     description: Get watched movies list
 *     tags:
 *       - Movies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Movie id
 *                   title:
 *                     type: string
 *                     description: Movie title
 *                   year:
 *                     type: integer
 *                     description: Movie year
 *                   rating:
 *                     type: integer
 *                     format: double
 *                     description: Movie rating
 *                   image:
 *                     type: string
 *                     description: Movie image
 *               example:
 *                 - _id: "60742346a7cf0642ae2b61cc"
 *                   userId: "60706364f94bee11d74e9acf"
 *                   movieId: "30219"
 *                   title: "Battle Hymn (1957)"
 *                   year: 1957
 *                   image: "https://yts.mx/assets/images/movies/battle_hymn_1957/large-cover.jpg"
 *                   rating: 6.4
 *                   type: "watch"
 *                 - _id: "60742346a7cf0642ae2b61bb"
 *                   movieId: "30220"
 *                   userId: "60706364f94bee11d74e9acf"
 *                   title: "Avengers: Endgame"
 *                   year: 2019
 *                   rating: 8.4
 *                   image: "https://yts.mx/assets/images/movies/avengers_endgame_2019/large-cover.jpg"
 *                   type: "watch"
 *   
 *       400:
 *         description: Bad request, Failed to load watched movies list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to load watched list !"
 * 
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 * 
 */

/**
 * @swagger
 *
 * /api/movies/add/tofavorite:
 *   post:
 *     summary: Add a movie to favorite list
 *     description: Add a movie to favorte list a connected user
 *     tags:
 *       - Movies
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: Movie id
 *                 required: true
 *               title:
 *                 type: string
 *                 description: Movie title
 *                 required: true
 *               year:
 *                 type: integer
 *                 description: Movie year
 *                 required: true
 *               image:
 *                 type: string
 *                 description: Movie image
 *                 required: true
 *               rating:
 *                 type: integer
 *                 format: double
 *                 description: Movie rating
 *                 required: true
 *             example:
 *               movieId: 30219
 *               title: "Battle Hymn (1957)"
 *               year: 1957
 *               image: "https://yts.mx/assets/images/movies/battle_hymn_1957/large-cover.jpg"
 *               rating: 6.4
 *
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 message:
 *                   type: string
 *                   description: Success message
 *               example:
 *                 success: true
 *                 message: "Added to favorite lists !"
 *   
 *       400:
 *         description: Bad request, Failed to add movie to favorite list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to add the specified movie to favorite list !"
 * 
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 * 
 */

/**
 * @swagger
 *
 * /api/movies/add/towatch:
 *   post:
 *     summary: Add a movie to watched list
 *     description: Add a movie to watched list
 *     tags:
 *       - Movies
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: Movie id
 *                 required: true
 *               title:
 *                 type: string
 *                 description: Movie title
 *                 required: true
 *               year:
 *                 type: integer
 *                 description: Movie year
 *                 required: true
 *               image:
 *                 type: string
 *                 description: Movie image
 *                 required: true
 *               rating:
 *                 type: integer
 *                 format: double
 *                 description: Movie rating
 *                 required: true
 *             example:
 *               movieId: 30219
 *               title: "Battle Hymn (1957)"
 *               year: 1957
 *               image: "https://yts.mx/assets/images/movies/battle_hymn_1957/large-cover.jpg"
 *               rating: 6.4
 *
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *               example:
 *                 success: true
 *   
 *       400:
 *         description: Bad request, Failed to add movie to favorite list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to add the specified movie to watched list !"
 * 
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 * 
 */

/**
 * @swagger
 *
 * /api/movies/delete/fromfavorite/{movieid}:
 *   delete:
 *     summary: Delete movie from favorite list
 *     description: Delete a movie from favorite list
 *     tags:
 *       - Movies
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: movieid
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Success message
 *               example:
 *                 success: true
 *                 message: "Removed from favorite list !"
 *   
 *       400:
 *         description: Bad request, Failed to add movie to favorite list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to remove from favorite list !"
 * 
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 * 
 */