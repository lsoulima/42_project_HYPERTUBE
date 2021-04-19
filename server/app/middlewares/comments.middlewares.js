const Comment = require("../models/comments.model");

exports.deleteCommentMovie = async ( req, res, next ) => {
	try {
		const commentid = req.params.id;
        
        await Comment.findById({ '_id': commentid })
        .then((comment) => {
            if ( !comment ) return res.status( 404 ).json({ success: false, error: "The specified comment is not found !" })
            else next();
        })
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while delete the specified comment, try later !"
		});
	}
}