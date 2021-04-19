const Comment = require("../models/comments.model");

exports.getCommentsMovie = async ( req, res ) => {
	try {
		const movieid = req.params.id;

		await Comment.find({ 'movieId': movieid }, { "__v": 0, "movieId": 0 })
		.populate({ path: "userId", select: "username profile" })
		.then((data) => res.status( 200 ).json( data ))
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to get movie comments !" }));
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while get movie comments, try later !"
		});
	}
}

exports.addCommentMovie = async ( req, res ) => {
	const userid = req.user._id;
	const movieid = req.params.id;
	const { body } = req.body;

	try {
		if ( !body ) { return res.status( 400 ).json({ success: false, error: "Invalid data provided !" }) }
		else {
			const newComment = new Comment({
				userId: userid,
				movieId: movieid,
				content: body
			});
			
			await newComment.save()
			.then( async (comment) => {
				await Comment.findById({ '_id': comment._id }, { "__v": 0, "movieId": 0 })
				.populate({ path: "userId", select: "username profile" })
				.then((usercom) => {
					return res.status( 200 ).json({ success: true, message: "Your comment has been added !", comment: usercom })
				});
			})
			.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to add a comment for the specified movie !" }));
		}
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while add comment for the specified movie, try later !"
		});
	}
}

exports.deleteCommentMovie = async ( req, res ) => {
	try {
		const commentid = req.params.id;
		
		await Comment.findByIdAndDelete({ '_id': commentid })
		.then(() => res.status( 200 ).json({ success: true, message: "Your comment has been deleted !" }))
		.catch((error) => res.status( 400 ).json({ success: false, error: "Failed to delete the specified comment !" }));
	} catch ( e ) {
		return res.status( 400 ).json({
			success: false,
			error: "An error has occurend while delete the specified comment, try later !"
		});
	}
}