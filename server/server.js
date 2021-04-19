// Sets up all the required env variables
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const passport = require('passport');

// Connecting to the database
mongoose.connect(process.env.URL_MONGODB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

mongoose.connection.on('connected' , () => {
	console.log("\x1b[32m", "**** Database got connected !", " ****\x1b[0m");
});

mongoose.connection.on('error', () => {
	console.log("\x1b[31m", "---- Failed to connect to the database !", " ----\x1b[0m");
});

// Create express app
const app = express();
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(express.json());

app.use(cookieParser());

// Cors handles cross origin resource sharing
app.use(cors({
	origin: process.env.URL_CLIENT,
	credentials: true
}));

// Add Static folder: user pictures, subtitles
app.use(`/api/public/users-pictures`, express.static(path.join(__dirname, '/public/users-pictures')));
app.use(`/api/public/subtitles`, express.static(path.join(__dirname, '/public/subtitles')));

// Setup api documentation
require("./config/swagger")( app );

// Config passport
require("./config/passport")( passport );
app.use( passport.initialize() );

// Load index routes
app.use('/api', require('./app/routes/index')( passport ));

// Handle 404 responses
app.use(( req, res, next ) => {
	const err = new Error("Sorry can't find that !");
	err.status = 404;
	next( err );
});

// Error handler
app.use(( err, req, res, next ) => {
	res.status( err.status || 500 ).json({
		success: false,
		error: err.message || "Something goes wrong !"
	});
});

const httpOptions = {
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem')
}

const server = http.createServer( httpOptions, app );
// the server starts listening
if ( process.env.NODE_ENV !== "test" ) {
	server.listen( 3001, () => {
		console.log("\x1b[32m", `*** Server is listening on port 3001 ( ${new Date()} ) ***`, "\x1b[0m");	
	}).on('error', ( err ) => {
		console.log("\x1b[31m", `--- Error happened ( ${new Date()} ) : ${err}`, "---", "\x1b[0m");
	});
}

module.exports = { server, mongoose };
