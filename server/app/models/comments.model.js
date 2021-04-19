const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const commentSchema = Schema(
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
        content: {
            type: SchemaTypes.String,
			required: true,
            lowercase: true,
			trim: true
        },
        createdAt: {
			type: SchemaTypes.Date,
			default: Date.now
		}
    },
	{ autoCreate: true }
)

module.exports = mongoose.model("Comments", commentSchema);
