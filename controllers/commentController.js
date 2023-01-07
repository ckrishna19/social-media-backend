const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const commentController = {
	writeComment: async (req, res) => {
		try {
			const post = await Post.findById({ _id: req.body.postId });
			if (!post) return res.status(403).json({ message: "No post found" });
			const postedBy = await User.findById({ _id: post.postedBy });
			console.log(postedBy._id.toString(), req.user.payload.payload);
			if (postedBy.friendList.includes(req.user.payload.payload) || req.user.payload.payload === postedBy._id.toString()) {
				const newComment = await Comment.create({ ...req.body, commentedBy: req.user.payload.payload });
				return res.status(200).json({ message: "success", newComment });
			}
			return res.status(403).json({ message: "Sorry you can't comment because you are not friend with this user" });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	editComment: async (req, res) => {
		try {
			const comment = await Comment.findById(req.params.id);
			if (!comment) return res.status(403).json({ message: "Sorry no comments here" });
			if (req.user.payload.payload !== commentedBy)
				return res.status(403).json({ message: "Sorry you can't edit this comment" });
			await comment.update(req.body, { new: true });
			return res.status(201).json({ message: "Success", comment });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	deleteComment: async (req, res) => {
		try {
			const comment = await Comment.findById(req.params.id);
			if (!comment) return res.status(403).json({ message: "sorry this comment doesnot found in database" });
			if (req.user.payload.payload !== commentedBy || req.user.payload.payload !== postedBy)
				return res.status(403).json({ message: "sorry you can't delete this comment " });
			await comment.delete();

			return res.status(201).json({ message: "success" });
		} catch (error) {
			return res.status(403).json({ message: "Sorry no comments here" });
		}
	},

	getAllCommentOfSinglePost: async (req, res) => {
		try {
			const allComments = await Comment.find({ id: req.body.postId });
			if (!allComments) return res.status(403).json({ message: "sorry no comments here" });
			return res.status(200).json({ message: "success", allComments });
		} catch (error) {
			return res.status(403).json({ message: "Sorry no comments here" });
		}
	},
};

module.exports = commentController;
