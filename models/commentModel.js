const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		commentText: { type: String },
		image: { type: String },
		commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
