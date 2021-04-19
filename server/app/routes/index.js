module.exports = ( passport ) => {
	const router = require("express").Router();

	return router
	.use("/users", require("./users.routes")( passport ))
	.use("/movies", require("./movies.routes")( passport ))
	.use("/comments", require("./comments.routes")( passport ))
};