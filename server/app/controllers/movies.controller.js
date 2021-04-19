const Movies = require("../models/movies.model");
const {
	loadMoviesList,
	loadMovieDetails,
	loadSuggestionsMovie,
} = require("../helpers/movie.helper");
const path = require("path");
const fs = require("fs");
const torrentStream = require("torrent-stream");
const parseRange = require("range-parser");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const OS = require("opensubtitles-api");
const OpenSubtitles = new OS("UserAgent");
const srt2vtt = require("srt-to-vtt");
const http = require("http");
const DEFAULT_SORT = "like_count";
const SEARCH_SORT = "title";

exports.getList = async (req, res) => {
	try {
		const userid = req.user._id;
		const options = {
			limit: req.query.limit ? parseInt(req.query.limit) : 50,
			page: req.query.page ? parseInt(req.query.page) : 1,
			sort: req.query.search && req.query.sort ? req.query.sort : req.query.search ? SEARCH_SORT : req.query.sort,
			filter: {
				genre: req.query.genre ? req.query.genre : "",
				rating: req.query.rating && parseInt(req.query.rating) >= 0 && parseInt(req.query.rating) <= 9 ? parseInt(req.query.rating) : 0,
				quality: req.query.quality ? req.query.quality : "",
			},
			search: req.query.search ? req.query.search : "",
		};

		await loadMoviesList(options, userid)
			.then((movies) => res.status( 200 ).json(movies))
			.catch((error) => res.status( 400 ).json({ success: false, error: error.message }) );
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while load movies list, try later !",
		});
	}
};

exports.getMovie = async (req, res) => {
	const id = parseInt(req.params.id);
	const userid = req.user._id;

	try {
		await loadMovieDetails(id, userid)
		.then((details) => {
			if (!details) return res.status(404).json({ success: false, error: "The specified movie is not found !" });
			else return res.status( 200 ).json( details );
		})
		.catch((error) => res.status( 400 ).json({ success: false, error: error.message }) );
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while load informations about the specified movie, try later !"
		});
	}
};

exports.getMovieSuggestions = async (req, res) => {
	const id = parseInt(req.params.id);

	try {
		await loadSuggestionsMovie(id)
		.then((suggestions) => res.status( 200 ).json(suggestions))
		.catch((error) => res.status( 400 ).json({ success: false, error: error.message }) );
	} catch (e) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while load suggestions list of the specified movie, try later !"
		});
	}
};

exports.addFavoriteMovie = async (req, res) => {
	const { _id } = req.user;
	const { movieId, title, year, image, rating } = req.body;

	try {
		if (!movieId || !title || !year || !image || !rating) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else {
			const newUserMovie = new Movies({
				userId: _id,
				movieId: movieId,
				title: title,
				year: year,
				image: image,
				rating: rating,
				type: "favorite",
			});

			await newUserMovie
			.save()
			.then(() => res.status( 200 ).json({ success: true, message: "Added to favorite lists !" }) )
			.catch((error) => res.status( 200 ).json({ success: false, error: "Failed to add the specified movie to favorite list !" }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while add the specified movie to favorite list, try later !",
		});
	}
};

exports.addWatchedMovie = async (req, res) => {
	const { _id } = req.user;
	const { movieId, title, year, image, rating } = req.body;

	try {
		if (!movieId || !title || !year || !image || !rating) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else {
			const newUserMovie = new Movies({
				userId: _id,
				movieId: movieId,
				title: title,
				year: year,
				image: image,
				rating: rating,
				type: "watch",
			});

			await newUserMovie
			.save()
			.then(() => res.status( 200 ).json({ success: true }))
			.catch((error) => res.status( 200 ).json({ success: false, error: "Failed to add the specified movie to watched list !" }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({ success: false, error: "An error has occurend while add the specified movie to watched list, try later !" });
	}
};

exports.getFavoriteList = async (req, res) => {
	const { _id } = req.user;

	try {
		await Movies.find({ 'userId': _id, 'type': "favorite" }, { '__v': 0, 'createdAt': 0 })
		.then((data) => res.status( 200 ).json(data))
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to load favorites list !" }) );
	} catch (e) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while load favorites list, try later !",
		});
	}
};

exports.getWatchedList = async (req, res) => {
	const { _id } = req.user;

	try {
		await Movies.find({ 'userId': _id, 'type': "watch" }, { '__v': 0, 'createdAt': 0 })
		.then((data) => res.status( 200 ).json(data))
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to load watched list !" }) );
	} catch (e) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while load watched list, try later !",
		});
	}
};

exports.deleteFromFavoriteList = async (req, res, next) => {
	const movieId = req.params.movieid;
	const userid = req.user._id;

	try {
		await Movies.findOneAndDelete({ $and: [{ 'movieId': movieId }, { 'userId': userid }, { 'type': "favorite" }] })
		.then(() => res.status( 200 ).json({ success: true, message: "Removed from favorite list !" }) )
		.catch(() => res.status( 400 ).json({ success: false, error: "Failed to remove from favorite list !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while remove the specified movie from favorite list, try later !"
		});
	}
};

const trackers = [
	"udp://glotorrents.pw:6969/announce",
	"udp://tracker.opentrackr.org:1337/announce",
	"udp://torrent.gresille.org:80/announce",
	"udp://tracker.openbittorrent.com:80",
	"udp://tracker.coppersurfer.tk:6969",
	"udp://tracker.leechers-paradise.org:6969",
	"udp://p4p.arenabg.ch:1337",
	"udp://tracker.internetwarriors.net:1337",
	"udp://tracker.coppersurfer.tk:80/announce",
	"udp://ipv6.tracker.harry.lu:80/announce",
];

exports.streamHandler = async (req, res) => {
	const magnet_trackers = typeof req.query.tr == "undefined" || !req.query.tr ? [] : req.query.tr;
	magnet_trackers.forEach((tracker) => { if ( !trackers.includes(tracker) ) trackers.push(tracker); });
	let engines = [];
	const hash = String(req.params.hash).toLowerCase();
	
	if (hash && req.method === "GET") {
		if (hash.match(/([0-9a-f]{6})([0-9a-f]{34})/) && req.headers.range) {
			const engine = torrentStream("magnet:?xt=urn:btih:" + hash, {
				tmp: __dirname + "/../../public/stream",
				trackers: trackers,
			});

			engines[hash] = engine;
			await engine.on("ready", () => {
				// get largest file index
				let large = 0;
				for (i = 1; i < engine.files.length; i++) if (engine.files[i].length > engine.files[large].length) large = i;
				// the first file mostly is the video
				const file = engine.files[large];
				const re = /(?:\.([^.]+))?$/;
				const ext = re.exec(file.name)[1];
				file.select();
				const len = file.length;
				// console.log(req.headers.range);
				const ranges = parseRange(len, req.headers.range, { combine: true });

				if (ranges.type === "bytes" && ranges !== -1 && ranges !== -2) {
					const range = ranges[0];
					res.status(206);

					if (["mp4", "webm", "ogv", "ogg"].includes(ext)) {
						res.set({
							"Accept-Ranges": "bytes",
							"Content-Length": 1 + range.end - range.start,
							"Content-Range": `bytes ${range.start}-${range.end}/${len}`,
						});
						res.set({ "Content-Type": `video/${ext === "ogv" ? "ogg" : ext}` });
						const stream = file.createReadStream({ start: range.start, end: range.end });
						stream.pipe(res);
					} else if (ext === "mkv") {
						res.set({
							"Accept-Ranges": "bytes",
							"Content-Length": 1 + range.end - range.start,
							"Content-Range": `bytes ${range.start}-${range.end}/${len}`,
						});
						res.set({ "Content-Type": "video/webm" });
						const stream = file.createReadStream();

						ffmpeg(stream)
						.setFfmpegPath(ffmpegPath)
						.videoCodec("libvpx")
						.audioCodec("libvorbis")
						.format("webm")
						.audioBitrate(128)
						.videoBitrate(8000)
						.outputOptions(["-deadline realtime", "-error-resilient 1"])
						.on("start", function (cmd) {})
						.on("end", function () {})
						.on("error", function (err) {})
						.on("progress", function (progress) {})
						.pipe(res, { end: true });
					} else res.status(415).end();
				} else file.createReadStream().pipe(res);
			});
			engine.on("download", function (index) {});
			engine.on("upload", function (index, offset, length) {});
			engine.on("idle", function () {});
			engine.on("error", function (err, info) {});
		} else res.status( 400 ).end();
	} else res.status( 400 ).end();
};

exports.subtitlesHandler = async (req, res) => {
	const imdbid = String(req.params.imdb).toLowerCase();
	const dirSubtitles = __dirname + "/../../public/subtitles";

	try {
		fs.exists(`${dirSubtitles}/${imdbid}en.vtt`, (ex) => {
			if ( ex ) { return res.send({ success: true }); }
			else {
				OpenSubtitles.api.LogIn("sberrich", "sberrich1234@", "en", "UserAgent")
				.then((response) => {
					if (response) {
						if (response.status === "200 OK") {
							if (`$${dirSubtitles}/${imdbid}en.vtt`) {
								OpenSubtitles.search({ imdbid: imdbid })
								.then((subtitles) => {
									if ( subtitles.en ) {
										http.get(subtitles.en.utf8, (resen) => {
											const path = `${dirSubtitles}/${imdbid}en.srt`;
											const filePath = fs.createWriteStream(path);

											resen.pipe(filePath);
											filePath.on("finish", () => {
												filePath.close();
												fs.createReadStream(filePath.path)
												.pipe( srt2vtt() )
												.pipe( fs.createWriteStream(`${dirSubtitles}/${imdbid}en.vtt`) );
												fs.exists(path, (ex) => {
													if (ex) { fs.unlinkSync(path) }
												});
											});
										});
									}
									if ( subtitles.fr ) {
										http.get(subtitles.fr.utf8, (resfr) => {
											const path = `${dirSubtitles}/${imdbid}fr.srt`;
											const filePath = fs.createWriteStream(path);

											resfr.pipe(filePath);
											filePath.on("finish", () => {
												filePath.close();
												fs.createReadStream(filePath.path)
												.pipe(srt2vtt())
												.pipe(
													fs.createWriteStream( `${dirSubtitles}/${imdbid}fr.vtt` )
													.on("finish", () => {
														fs.exists( `${dirSubtitles}/${imdbid}fr.vtt`, (ex) => {
															if ( ex ) res.send({ status: "ok" });
														});
													})
												);
												fs.exists(path, (ex) => {
													if ( ex ) fs.unlinkSync(path);
												});
											});
										});
									}
									if ( subtitles.ar ) {
										http.get(subtitles.ar.utf8, (resar) => {
											const path = `${dirSubtitles}/${imdbid}ar.srt`;
											const filePath = fs.createWriteStream(path);

											resar.pipe(filePath);
											filePath.on("finish", () => {
												filePath.close();
												fs.createReadStream(filePath.path)
												.pipe(srt2vtt())
												.pipe( fs.createWriteStream( `${dirSubtitles}/${imdbid}ar.vtt` ) );
												fs.exists(path, (ex) => {
													if ( ex ) fs.unlinkSync(path);
												});
											});
										});
									} else if (subtitles.ar === undefined) {
										return res.send({ ar: "not found" });
									}
								});
							}
						} else {
							return res.status( 400 ).json({ success: false, error: "Failed to login open-subtitles account !" });
						}
					}
				});
			}}
		);
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while create subtitles for the specified movie, try later !"
		});
	}
};
