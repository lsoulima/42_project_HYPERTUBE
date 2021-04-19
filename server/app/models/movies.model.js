const mongoose = require("mongoose");
require("mongoose-double")( mongoose );
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const movieSchema = new Schema(
	{
		userId: {
			type: SchemaTypes.ObjectId,
			required: true,
			ref: "User"
		},
		movieId: {
			type: SchemaTypes.String,
			required: true,
			trim: true
		},
		title: {
			type: SchemaTypes.String,
			required: true,
			trim: true
		},
		year: {
			type: SchemaTypes.Number,
			required: true,
			trim: true
		},
		image: {
			type: SchemaTypes.String,
			required: true,
			trim: true
		},
		rating: {
			type: SchemaTypes.Double,
			required: true,
			trim: true
		},
		type: {
			type: SchemaTypes.String,
			required: true,
			enum: ["watch", "favorite"],
			trim: true
		},
		createdAt: {
			type: SchemaTypes.Date,
			default: Date.now
		}
	},
	{ autoCreate: true }
);

module.exports = mongoose.model("Movies", movieSchema);