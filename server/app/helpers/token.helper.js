const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const 		hashPassword = ( text ) => {
	const hash = bcrypt.hashSync( text, 11 );
	return hash;
}

const 		compareHash = ( text, hash ) => {
	return  bcrypt.compareSync( text, hash );
}

const 		hash = ( text ) => {
	let salt = crypto.randomBytes( 16 ).toString( 'hex' );
	let hash = crypto.pbkdf2Sync( text, salt, 875492, 64, `sha512` ).toString(`hex`);

	return hash;
}


module.exports = {
	generatePasswordToken: ( password ) => {
		return hashPassword( password );
	},
	generateToken: ( text ) => {
		return hash( text ); 
	},
	compare: ( password, hash ) => {
		return compareHash( password, hash );
	},
	generateJwtToken: ( payload ) => {
		return jwt.sign( payload, process.env.JWT_PKEY, { expiresIn: process.env.JWT_EXPIRES_IN } );
	},
	verifyJwtToken: ( token ) => {
		try {
			return jwt.verify( token, process.env.JWT_PKEY );
		} catch ( e ) { return false; }
	}
}