const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		postText: { type: String },
		image: { type: String },
		postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
