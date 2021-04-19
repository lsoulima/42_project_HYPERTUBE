const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateJwtToken } = require("../helpers/token.helper");

const userSchema = new Schema(
	{
		firstname: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			validate: /^[a-zA-Z- ]{3,30}$/
		},
		lastname: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			validate: /^[a-zA-Z- ]{3,30}$/
		},
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate: /^[a-z]+(([-_.]?[a-z0-9])?)+$/,
			minLength: 3,
			maxLength: 20
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate: /[a-zA-Z0-9-_.]{1,50}@[a-zA-Z0-9-_.]{1,50}\.[a-z0-9]{2,10}$/
		},
		password: {
			type: String,
			required: true
		},
		profile: {
			type: String,
			default: null
		},
		fortyTwoId: {
			type: String,
			default: null
		},
		googleId: {
			type: String,
			default: null
		},
		linkedinId: {
			type: String,			
			default: null
		},
		aToken: {
			type: String,
			default: null
		},
		rToken: {
			type: String,
			default: null
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		modifyAt: {
			type: Date,
			default: null
		}
	},
	{ autoCreate: true }
);

userSchema.methods.FortyTwoAuth = async ( data ) => {
	const User = mongoose.model("User");
	const userO = await User.findOne({ 'fortyTwoId': data.fortyTwoId });
	let payload;

	if ( !userO ) {
		// Create a new user
		if ( await User.findOne({ 'username': data.username }) ) {
			return { token: null, error: "The username is already exists !" }
		} else if ( await User.findOne({ 'email': data.email }) ) {
			return { token: null, error: "The email is already exists !" }
		} else {
			await data.save();
			payload = { _id: data._id, usernames: data.username };
		}
	} else {
		payload = { _id: userO._id, usernames: userO.username };
	}
	return { token: generateJwtToken( payload ), error: null }
}

userSchema.methods.GoogleAuth = async ( data ) => {
	const User = mongoose.model("User");
	const userO = await User.findOne({ 'googleId': data.googleId });
	let payload;

	if ( !userO ) {
		// Create a new user
		if ( await User.findOne({ 'username': data.username }) ) {
			return { token: null, error: "The username is already exists !" }
		} else if ( await User.findOne({ 'email': data.email }) ) {
			return { token: null, error: "The email is already exists !" }
		} else {
			await data.save();
			payload = { _id: data._id, usernames: data.username };
		}
	} else {
		payload = { _id: userO._id, usernames: userO.username };
	}
	return { token: generateJwtToken( payload ), error: null }
}

userSchema.methods.LinkedinAuth = async ( data ) => {
	const User = mongoose.model("User");
	const userO = await User.findOne({ 'linkedinId': data.linkedinId });

	if ( !userO ) {
		// Create a new user
		if ( await User.findOne({ 'username': data.username }) ) {
			return { token: null, error: "The username is already exists !" }
		} else if ( await User.findOne({ 'email': data.email }) ) {
			return { token: null, error: "The email is already exists !" }
		} else {
			await data.save();
			payload = { _id: data._id, usernames: data.username };
		}
	} else {
		payload = { _id: userO._id, usernames: userO.username };
	}
	return { token: generateJwtToken( payload ), error: null }
}


module.exports = mongoose.model('User', userSchema);