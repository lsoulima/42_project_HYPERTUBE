const User = require("../app/models/user.model");
const JWTstrategy = require("passport-jwt").Strategy;
const JWTExtract = require("passport-jwt").ExtractJwt;
const FortyTwoStrategy = require("passport-42").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const LinkedinStrategy = require("passport-linkedin-oauth2").Strategy;
const usernameGenerator = require("username-generator");
const { generatePasswordToken } = require("../app/helpers/token.helper");

// JWT Strategy
let jwtOptions = {}
jwtOptions.jwtFromRequest = JWTExtract.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_PKEY;

const StrategyJWT = new JWTstrategy( jwtOptions, async ( payload, next ) => {
	await User.findById({ '_id': payload._id }, { 'username': 1 })
	.then((user) => {
		if (user) next(null, user);
		else next(null, false);
	})
	.catch((err) => {
		next( false, null );
	})
});

// 42 Strategy
const Strategy42 = new FortyTwoStrategy({
	clientID: process.env.FORTYTWO_APP_ID,
	clientSecret: process.env.FORTYTWO_APP_SECRET,
	callbackURL: "http://localhost:3001/api/users/auth/42/callback"
}, async (accessToken, refreshToken, profile, next) => {
	const FortyTwoUser = new User({
		firstname: profile._json.first_name || "test",
		lastname: profile._json.last_name || "forthytwoacc",
		username: profile._json.login,
		email: profile._json.email,
		profile: profile._json.image_url,
		fortyTwoId: profile._json.id,
		password: generatePasswordToken( profile._json.email + Date.now().toString() )

	});
	const data = await FortyTwoUser.FortyTwoAuth( FortyTwoUser );
	next( null, data );
});

// Google Strategy
const StrategyGoogle = new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "http://localhost:3001/api/users/auth/google/callback",
}, async (accessToken, refreshToken, profile, next) => {
	const googleUser = new User({
		firstname: profile._json.given_name || "test",
		lastname: profile._json.family_name || "googleacc",
		username: usernameGenerator.generateUsername("-", 15),
		email: profile.email,
		profile: profile.picture,
		googleId: profile._json.sub,
		password: generatePasswordToken( profile.email + Date.now().toString() )
	});
	const data = await googleUser.GoogleAuth( googleUser );
	next( null, data );
});

// Linkedin strategy
const StrategyLinkedin = new LinkedinStrategy({
	clientID: process.env.LINKEDIN_CLIENT_ID,
	clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
	callbackURL: "http://localhost:3001/api/users/auth/linkedin/callback",
	scope: ['r_emailaddress', 'r_liteprofile']
}, async (accessToken, refreshToken, profile, next) => {
	const linkedinUser = new User({
		firstname: profile.name.givenName || "test",
		lastname: profile.name.familyName || "linkedinacc",
		username: usernameGenerator.generateUsername("-", 15),
		email: profile.emails[0].value,
		profile: profile.photos[3].value,
		linkedinId: profile.id,
		password: generatePasswordToken( profile.emails[0].value + Date.now().toString() )
	});
	const data = await linkedinUser.LinkedinAuth( linkedinUser );
	next( null, data );
});


module.exports = ( passport ) => {
	passport.use( StrategyJWT );
	passport.use( Strategy42 );
	passport.use( StrategyGoogle );
	passport.use( StrategyLinkedin );

	passport.serializeUser( (user, done) => {
		done(null, user._id);
	});
	
	passport.deserializeUser( async (_id, done) => {
		await User.findById({ '_id': id }).then((user) => { done( null, user ); })
	});
}