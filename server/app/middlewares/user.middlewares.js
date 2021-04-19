const mongoose = require("mongoose")
const { compare } = require("../helpers/token.helper");
const User = require("../models/user.model");
const { validateRegisterData, validateEmail, validatePassword, usernameExists, isValidOldPass, validateNewData } = require("../validators/user.validators");

// POST - Middleware for register endpoint -
exports.register = async ( req, res, next ) => {
	const { firstname, lastname, username, email, password, confirmpassword } = req.body;
	
	try {
		if ( !firstname || !lastname || !username || !email || !password || !confirmpassword ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else {
			await validateRegisterData( firstname, lastname, username, email, password, confirmpassword )
			.then(() => { next(); })
			.catch((err) => res.status( 400 ).json({ success: false, error: err.message }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while validate register informations, try later !"
		});
	}
}

// POST - Middleware for login endpoint -
exports.login = async ( req, res, next ) => {
	const { username, password } = req.body;

	try {
		if ( !username || !password )  {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else {
			await usernameExists( username )
			.then((user) => {
				if ( !user || !compare( password, user.password ) ) return res.status( 400 ).json({ success: false, error: "The username or password is incorrect !" });
				else if ( !user.aToken ) next();
				else return res.status( 400 ).json({ success: false, error: "Must confirm your account first !" });
			})
			.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to validate your account !" }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while validate validate login informations, try later !"
		});
	}
}

// POST - Middleware for reset account -
exports.resetPassword = async ( req, res, next ) => {
	const { email } = req.body;
	let error;

	try {
		if ( !email ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else if ( error = validateEmail( email ) ) {
			return res.status( 400 ).json({ success: false, error: error.message });
		} else {
			await User.findOne({ 'email': email.toLowerCase().trim() })
			.then((user) => {
				if ( !user ) return res.status( 400 ).json({ success: false, error: "The account is not found !" });
				else next();
			})
			.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to validate the email address !" }));
		}
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while validate the email, try later !"
		});
	}
}

// PATCH - Middleware for set a new password after reset -
exports.newpassword = async ( req, res, next ) => {
	const { newpassword, confirmpassword, token } = req.body;
	let error;

	try {
		if ( !newpassword || !confirmpassword || !token ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else {
			// Validate reset token
			await User.findOne({ 'rToken': token })
			.then((user) => {
				if ( !user ) {
					return res.status( 400 ).json({ success: false, error: "The reset token is invalid !" });
				} else if ( error = validatePassword( newpassword ) ) {
					return res.status( 400 ).json({ success: false, error: error.message });
				} else if ( newpassword !== confirmpassword ) {
					return res.status( 400 ).json({ success: false, error: "The passwords doesn't match !" });
				} else {
					next();
				}
			})
		}
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while validate passwords, try later !"
		});
	}
}

// PATCH - Middleware for activation account endpoint -
exports.verifyAccount = async ( req, res, next ) => {
	const { token } = req.body;
	
	try {
		if ( !token ) {
			return res.status( 400 ).json({ success: false, error: "No token found !" });
		} else {
			await User.findOne({ 'aToken': token })
			.then((user) => {
				if ( !user ) return res.status( 400 ).json({ success: false, error: "The activation token is invalid or already activated !" });
				else next();
			})
			.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to validate the activation token !" }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while validate activation token, try later !"
		});
	}
}

// PATCH - Middleware for change password endpoint -
exports.changepassword = async ( req, res, next ) => {
	const { _id } = req.user;
	const { oldpassword, newpassword, confirmpassword } = req.body;
	let error;

	try {
		if ( !oldpassword || !newpassword || !confirmpassword ) {
			return res.status( 400 ).json({ success: false, error: "Invalid data provided !" });
		} else if ( (error = validatePassword( oldpassword )) || (error = validatePassword( newpassword )) ) {
			return res.status( 400 ).json({ success: false, error: error.message });
		} else if ( newpassword !== confirmpassword ) {
			return res.status( 400 ).json({ success: false, error: "Confirmation password doesn't match with the new password !" });
		} else {
			await isValidOldPass( _id, oldpassword )
			.then(() => { next(); })
			.catch((error) => res.status( 400 ).json({ success: false, error: error.message }) );
		}
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while validate passwords, try later !"
		});
	}
}

// PATCH - Middleware for edit user informations endpoint -
exports.editInfos = async ( req, res, next ) => {
	const { _id } = req.user;
	const { firstname, lastname, username, email } = req.body;
	
	try {
		await validateNewData( _id, firstname, lastname, username, email )
		.then(() => { next(); })
		.catch((err) => res.status( 400 ).json({ success: false, error: err.message }));
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while validate edited informations, try later !"
		});
	}
}

const			loadUser = async ( id, username ) => {
	return new Promise( async (resolve, reject) => {
		try {
			await User.findOne(( typeof id != "undefined" && id ) ? { '_id': id } : { 'username': username })
			.then((user) => { resolve( user ); })
			.then((error) => { reject( error ); });
		} catch ( e ) {
			reject( e );
		}
	});
}

// GET - Middleware for load user by id OR username -
exports.findById = async ( req, res, next ) => {
	try {
		const id = mongoose.Types.ObjectId(req.params.id);

		await loadUser( id )
		.then((user) => {
			if ( !user ) return res.status( 404 ).json({ success: false, error: "The user is not found !" });
			else next();
		})
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while load informations about the specified user, try later !"
		});
	}
}

exports.findByUsername = async ( req, res, next ) => {
	try {
		const username = req.params.username.toLowerCase().trim();

		await loadUser( null, username )
		.then((user) => {
			if ( !user ) return res.status( 404 ).json({ success: false, error: "The user is not found !" });
			else next();
		})
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while load informations about the specified user, try later !"
		});
	}
}