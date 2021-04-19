const User = require("../models/user.model");
const { compare } = require("../helpers/token.helper");

const errInvalidFname = "The first name must contain between 3 and 20 letters !";
const errInvalidLname = "The last name must contain between 3 and 20 letters !";
const errUsername = "The username must contain between 3 and 20 letters or numbers (-, _ or.) !";
const errInvalidEmail = "Invalid email address !";
const errInvalidPassword = "Password must be at least eight characters long, at least one uppercase letter, one lowercase letter, one number and one special character !";
const errPasswordsNotMatch = "Password confirmation does not match the password provided !";
const errUsernameExists = "Username already exists !";
const errEmailExists = "Email address already exists !";
const errIncorrectOldPass = "Old password is incorrect !";
const errCatchValidateUserData = "An error occurred while validating account information, try later !";
const errCatchValidateNewDataUser = "There was a problem while validating  your new information, try later !";
const errCatchValidateOldPass = "An error occurred while verifying your old password, try later !";

// Validate the first name
const				validateFName = ( firstname ) => ( !/^[a-zA-Z- ]{3,30}$/.test( firstname ) ) ? new Error( errInvalidFname ) : null;

// Validate the last name
const				validateLName = ( lastname ) => ( !/^[a-zA-Z- ]{3,30}$/.test( lastname ) ) ? new Error( errInvalidLname ) : null;

// Validate the username
const				validateUsername = ( username ) => ( !/^[a-z]+(([-_.]?[a-z0-9])?)+$/.test( username.toLowerCase() ) ) ? new Error( errUsername ) : ( username.length < 3 || username.length > 20 ) ? new Error( errUsername ) : null;

// Validate the email
const				validateEmail = ( email ) => ( !/[a-zA-Z0-9-_.]{1,50}@[a-zA-Z0-9-_.]{1,50}\.[a-z0-9]{2,10}$/.test( email ) ) ? new Error( errInvalidEmail ) : null;

// Validate the password
const				validatePassword = ( password ) => ( !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/.test( password ) ) ? new Error( errInvalidPassword ) : null;

// Check if the email is unique
const 				emailExists = async ( email ) => await User.findOne({ 'email': email.toLowerCase().trim() });

// Runs a check for the email if exists or not
const 				isUniqueEmail = async ( email ) => ( await emailExists( email ) ) ? new Error( errEmailExists ) : null;

// Check if the username is unique
const 				usernameExists = async ( username ) => await User.findOne({ 'username': username.toLowerCase().trim() });

// Runs a check for the username if exists or not
const 				isUniqueUsername = async ( username ) => ( await usernameExists( username ) ) ? new Error( errUsernameExists ) : null;

// Runs some regex checks to validate the provided data
const				validateRegisterData = async ( firstname, lastname, username, email, password, confirmpassword ) => {
	let error;

	return new Promise( async (resolve , reject) => {
		try {
			if (( error = validateFName( firstname ) ) || ( error = validateLName( lastname ) ) || ( error = validateUsername( username ) ) ||
				( error = validateEmail( email ) ) || ( error = validatePassword( password ) ) || ( error = await isUniqueUsername( username ) ) ||
				( error = await isUniqueEmail( email ) )
			) { reject( error ); }
			else if ( password !== confirmpassword ) { reject( new Error( errPasswordsNotMatch ) ); }
			else { resolve(); }
		} catch ( e ) {
			reject( new Error( errCatchValidateUserData ) );
		}
	});
}

//Runs some regex checks to validate the data provided in a login request
const 				validateLoginData = ( username, password ) => {
	let error;
	return ( ( error = validateUsername( username ) ) || ( error = validatePassword( password ) ) ) ? error : null;
}

const 				isNewUsernameExists = async ( id, username ) => await User.findOne({ '_id': { $ne: id }, 'username': username });

const 				validateNewUsername = async ( id, username ) => ( await isNewUsernameExists( id, username ) ) ? new Error( errUsernameExists ) : null;

const 				isNewEmailExists = async ( id, email ) => await User.findOne({ '_id': { $ne: id }, 'email': email });

const 				validateNewEmail = async ( id, email ) => ( await isNewEmailExists( id, email ) ) ? new Error( errEmailExists ) : null;

// Validate the edited information
const 				validateNewData = async ( id, firstname, lastname, username, email ) => {
	let error;

	return new Promise( async (resolve, reject) => {
		try {
			if (
				( firstname && ( error = validateFName( firstname ) ) ) ||
				( lastname && ( error = validateLName( lastname ) ) ) ||
				( username && ( error = validateUsername( username ) ) ) ||
				( email && ( error = validateEmail( email ) ) ) ||
				( username && ( error = await validateNewUsername( id, username ) ) ) ||
				( email && ( error = await validateNewEmail( id, email ) ) )
			) { reject( error ); }
			else { resolve(); }
		} catch ( e ) {
			reject( new Error( errCatchValidateNewDataUser ) );
		}
	});
}

// Check is old password for a user is valid or not
const 				isValidOldPass = async ( userid, oldPass ) => {	
	return new Promise( async (resolve, reject) => {
		try {
			await User.findById({ '_id': userid })
			.then( (user) => {
				if ( compare( oldPass, user.password ) ) resolve();
				else reject( new Error( errIncorrectOldPass ) );
			})
			.catch((err) => { reject( new Error("Failed to validate old password !") ) });
		} catch ( e ) {
			reject( new Error( errCatchValidateOldPass ) )
		}
	})
}

// Validate min size of a profile image
const				fileSizeFilter = 

module.exports = {
	validateFName,
	validateLName,
	validateUsername,
	validateEmail,
	validatePassword,
	emailExists,
	isUniqueEmail,
	usernameExists,
	isUniqueUsername,
	validateRegisterData,
	validateLoginData,
	isNewUsernameExists,
	validateNewUsername,
	isNewEmailExists,
	validateNewEmail,
	validateNewData,
	isValidOldPass
}