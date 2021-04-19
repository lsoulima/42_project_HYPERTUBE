const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { generateToken, generatePasswordToken, generateJwtToken, verifyJwtToken } = require("../helpers/token.helper");
const { sendConfirmationMail, sendRecoveryMail } = require("../helpers/mail.helper");
const TYPE_IMAGE = { "image/png": "png", "image/jpeg": "jpeg", "image/jpg": "jpg" };
const MAX_SIZE_PICTURE_PROFILE = 800 * 800;

exports.register = async ( req, res ) => {
	const { firstname, lastname, username, email, password } = req.body;
	
	try {
		const aToken = generateToken( email + username + Date.now().toString() );
		const hashPassword = generatePasswordToken( password );
		const newUser = User({
			'firstname': firstname,
			'lastname': lastname,
			'username': username,
			'email': email,
			'password': hashPassword,
			'aToken': aToken,
		});

		// Save new user
		await newUser.save()
		.then( async () => {
			// Send unique link for account confirmation
			await sendConfirmationMail( email, {
				'firstname': firstname,
				'lastname': lastname,
				'token': aToken
			});
			return res.status( 201 ).json({ success: true, message: "Your account has been created successfully !" });
		})
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to register !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while register, try later !"
		});
	}
}

exports.login = async ( req, res ) => {
	const { username } = req.body;

	try {
		await User.findOne({ 'username': username })
		.then((user) => {
			const payload = { _id: user.id, username: user.username }
			const token = generateJwtToken( payload );
			
			return res.status( 200 ).json({ success: true, message: "Logged successfully !", user: payload, token: token });
		})
		.catch((err) => res.status( 400 ).json({ success: false, error: "Failed to login !" }));
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while login, try later !"
		});
	}
}

exports.resetPassword = async ( req, res ) => {
	const { email } = req.body;

	try {
		const rToken = generateToken( email + Date.now().toString() );
		
		await User.findOneAndUpdate({ 'email': email.toLowerCase().trim() }, { 'rToken': rToken })
		.then( async (user) => {
			// Send unique link for reset account
			await sendRecoveryMail( email, {
				'firstname': user.firstname,
				'lastname': user.lastname,
				'token': rToken
			});
			return res.status( 200 ).json({ success: true, message: "Your password account has been reset !" });
		})
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to reset your password account !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while reset your password, try later !"
		});
	}
}

exports.newpassword = async ( req, res ) => {
	const { newpassword, token } = req.body;
	
	try {
		const hashNewPassword = generatePasswordToken( newpassword );

		await User.findOneAndUpdate({ 'rToken': token }, { 'rToken': null, 'password': hashNewPassword })
		.then(() => res.status( 200 ).json({ success: true, message: "Your password has been changed !" }) )
		.catch(() => res.status( 400 ).json({ success: false, error: "Failed to change your password !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while change your password, try later !"
		});
	}
}

exports.verifyAccount = async ( req, res ) => {
	const { token } = req.body;

	try {
		await User.findOneAndUpdate({ 'aToken': token }, { 'aToken': null })
		.then(() => res.status( 200 ).json({ success: true, message: "Your account has been activated !" }) )
		.catch(() => res.status( 400 ).json({ success: false, error: "Failed to activate your account !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while activate your account, try later !"
		});
	}
}

exports.profile = async ( req, res ) => {
	const { _id } = req.user;

	try {
		await User.findById({ '_id': _id }, { '__v': 0, 'aToken': 0, 'rToken': 0, 'password': 0 })
		.then((user) => {
			if ( user ) return res.status( 200 ).json({ success: true, data: user });
		})
		.catch(() => res.status( 400 ).json({ success: false, error: "Failed to load profile informations !" }) );
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while load profile informations, try later !"
		});
	}
}

exports.findById = async ( req, res ) => {
	const { id } = req.params;
	
	try {
		await User.findById({ '_id': id }, { '_id': 1, 'firstname': 1, 'lastname': 1, 'username': 1, 'profile': 1 })
		.then((user) => res.status( 200 ).json({ success: true, data: user }))
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to load user informations !" }));
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while get user informations, try later !"
		});
	}
}

exports.findByUsername = async ( req, res ) => {
	const username = req.params.username.toLowerCase().trim();
	
	try {
		await User.findOne({ 'username': username }, { '_id': 1, 'firstname': 1, 'lastname': 1, 'username': 1, 'profile': 1 })
		.then((user) => res.status( 200 ).json({ success: true, data: user }))
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to load user informations !" }));
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while get user informations, try later !"
		});
	}
}

exports.changepassword = async ( req, res ) => {
	const { _id } = req.user;
	const { newpassword } = req.body;

	try {
		const hash = generatePasswordToken( newpassword );
		await User.findByIdAndUpdate({ '_id': _id }, { 'password': hash })
		.then(() => res.status( 200 ).json({ success: true, message: "Your password has been changed successfully !" }) )
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to change your password !" }))
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while change your password, try later !"
		});
	}
}

exports.editInfos = async ( req, res ) => {
	const { _id } = req.user;
	const { firstname, lastname, username, email } = req.body;

	try {
		await User.findById({ '_id': _id })
		.then( async (user) => {
			await User.findByIdAndUpdate(
				{ '_id': _id },
				{
					'firstname': firstname || user.firstname,
					'lastname': lastname || user.lastname,
					'username': username || user.username,
					'email': email || user.email
				}
			)
			.then(() => res.status( 200 ).json({ success: true, message: "Your informations has been changed successfully !" }) )
			.catch(() => res.status( 400 ).json({ success: false, error: "Failed to change your informations !" }) );
		})
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error occurred while change your informations, try later !"
		});
	}
}

const			fileFilter = ( req, file, cb ) => {
	if ( ! TYPE_IMAGE.hasOwnProperty( file.mimetype ) ) cb( "Invalid file type, only jpeg, jpg or png are allowed !" );
	else cb( null, true );
}

const			storage = multer.diskStorage({
	destination: (req, file, cb) => { cb(null, "./public/users-pictures/") },
	filename: async (req, file, cb) => {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = verifyJwtToken( token );
		
		await User.findOne({ '_id': decoded._id })
		.then((user) => {
			cb(null, file.fieldname+ "-" +user.firstname+ "-" +user.lastname+ "-" +Date.now() + "." + TYPE_IMAGE[file.mimetype]);
		});
	}
});

const			uploadProfilePic = multer({ storage: storage, limits: { fileSize: MAX_SIZE_PICTURE_PROFILE }, fileFilter: fileFilter }).single("profile");

const 			deleteProfileFile = ( pathPic ) => {
	const newpath = path.join( __dirname, "../../" + pathPic.replace("http://localhost:3001/api", "") );
	if ( fs.existsSync( newpath ) ) fs.rmSync( newpath );
}

const			msgsMulterError = (code) => {
	return code == "LIMIT_FILE_SIZE" ? new Error("The file specified for profile too large !") : code == "LIMIT_UNEXPECTED_FILE" ? new Error("Unexpected filed to get profile picture from !") : new Error("An error has occurend while validate uploaded file !");
};

exports.uploadProfile = async ( req, res ) => {
	const { _id } = req.user;
	
	try {
		// After delete picture if exists upload the new one
		uploadProfilePic( req, res, async ( err ) => {
			if ( err instanceof multer.MulterError ) {
				return res.status( 400 ).json({ success: false, error: msgsMulterError( err.code ).message });
			} else if ( err ) {
				return res.status( 400 ).json({ success: false, error: "Failed to upload your profile picture !", });
			} else {
				await User.findById({ '_id': _id }, { 'profile': 1 })
				.then( async (user) => {
					// If profile picture already exists delete it
					if ( user.profile ) {
						deleteProfileFile( user.profile );
						await User.findByIdAndUpdate({ '_id': _id }, { profile: null })
					}
					// Update new profile
					const profile = req.file;
					if ( profile ) {
						await User.findByIdAndUpdate(
							{ '_id': _id },
							{ 'profile': "http://localhost:3001/api/" + profile.path },
							{ new: true }
						)
						.then((updated) => res.status(200).json({ success: true, message: "Your profile picture has been uploaded successfully !", data: updated.profile }) )
					} else {
						return res.status( 400 ).json({ success: false, message: "No profile picture has been specified !" });
					}
				});
			}
		});
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while upload profile picture, try later !"
		});
	}
}

exports.verifyToken = async ( req, res ) => {
	const { token } = req.body;

	try {
		if ( !token ) {
			return res.status( 400 ).json({ success: false, error: "No token to verify !" });
		} else {
			const decoded = verifyJwtToken( token );
			let valide;
			
			if ( decoded ) await User.findById({ '_id': decoded._id }) .then((user) => { valide = ( !user ) ? false : true });
			else valide = false;
			return res.status( 200 ).json({ success: true, valide: valide })
		}
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while verify token, try later !"
		});
	}
}

exports.logout = async ( req, res ) => {
	try {
		return res.clearCookie("token").status( 200 ).json({ success: true, message: "Logout successfully !" });
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while logout, try later !"
		});
	}
}