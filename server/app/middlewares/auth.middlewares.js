module.exports = ( passport ) => {
	let module = {}

	module.isAuth = ( req, res, next ) => {
		try {
			passport.authenticate("jwt", { session: false }, ( err, user ) => {
				if ( err || !user ) {
					return res.status( 401 ).json({ success: false, error: "Your are not authorized !" });
				} else {
					req.user = user;
					next();
				}
			})( req, res. next );
		} catch ( e ) {
			return res.status( 400 ).json({ success: false, error: "Can't login, try later !" });
		}
	}
	return module;
}