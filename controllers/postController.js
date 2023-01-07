const Post = require("../models/postModel");

const postController = {
	createPost: async (req, res) => {
		try {
			const postedBy = req.user.payload.payload;
			const newPost = await Post.create({ ...req.body, postedBy: postedBy });
			return res.status(201).json({ message: "success", newPost });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
	updatePost: async (req, res) => {
		try {
			const post = await Post.findById(req.params.id);
			if (!post) return res.status(403).json({ message: "This post doesnot contain in database" });

			if (req.user.payload.payload !== post.postedBy.toString())
				return res.status(403).json({ message: "You can't update others post " });
			const postTobeUpdate = await Post.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

			return res.status(201).json({ message: "success", postTobeUpdate });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
	deletePost: async (req, res) => {
		try {
			const post = await Post.findById(req.params.id);
			if (!post) return res.status(201).json({ message: "Sorry this document doesnot found" });
			if (req.user.payload.payload !== post.postedBy.toString())
				return res.status(403).json({ message: "You do not have permission to delete this post" });
			await post.deleteOne();
			return res.status(200).json({ message: "success" });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
	getAllPost: async (req, res) => {
		try {
			const allPost = await Post.find({});
			if (!allPost) return res.status(403).json({ message: "sorry there are no posts yet.." });
			return res.status(201).json({ message: "success", allPost });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
	getAllPostBySingleUser: async (req, res) => {
		try {
			const allPost = await Post.find({ _id: req.body.postedBy });
			if (!allPost) return res.status(201).json({ message: "User doesnot post anything", allPost });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
	likePost: async (req, res) => {
		try {
			const post = await Post.findById(req.params.id);
			if (!post) return res.status(403).json({ message: "This post doesnot found in database" });
			if (post.likes.includes(req.user.payload.payload))
				return res.status(403).json({ message: "You already like this post " });
			const tobeLike = await Post.findByIdAndUpdate(
				req.params.id,
				{ $push: { likes: req.user.payload.payload } },
				{ new: true }
			);

			return res.status(201).json({ message: "success", tobeLike });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
	unLikePost: async (req, res) => {
		try {
			const post = await Post.findById(req.params.id);
			if (!post) return res.status(403).json({ message: "This post doesnot found in database" });
			if (!post.likes.includes(req.user.payload.payload))
				return res.status(403).json({ message: "You didnot like this post yet " });
			const tobeUnlikePost = await Post.findByIdAndUpdate(
				req.params.id,
				{ $pull: { likes: req.user.payload.payload } },
				{ new: true }
			);
			return res.status(201).json({ message: "success", tobeUnlikePost });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
	getSinglePost: async (req, res) => {
		try {
			const singlePost = await Post.findById(req.params.id);
			if (!singlePost) return res.status(403).json({ message: "post not found" });
			return res.status(200).json({ message: "success", singlePost });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
};

module.exports = postController;
