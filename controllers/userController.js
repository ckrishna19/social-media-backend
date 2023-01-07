const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userController = {
	registerUser: async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email: email });
			if (user) return res.status(403).json({ message: "invalid!! user has already registered.." });
			const hashedPassword = await bcrypt.hash(password, 12);
			console.log(hashedPassword, password);
			const newUser = await User.create({ ...req.body, password: hashedPassword });

			return res.status(201).json({
				message: "user successfully created..",
				user: { ...newUser._doc, password: "" },
				token: generateToken({ payload: newUser._id }),
			});
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	getAllUser: async (req, res) => {
		try {
			const allUser = await User.find();
			if (!allUser) return res.status(200).json({ message: "sorry no user found" });

			return res.status(200).json({ message: "success", allUser });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	loginUser: async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email: email });
			if (!user) return res.status(403).json({ message: "invalid user... user did not registered yet" });
			const comparePassword = await bcrypt.compare(password, user.password);
			if (!comparePassword) return res.status(403).json({ message: "invalid password" });

			return res.status(200).json({
				message: "success",
				user: { ...user._doc, password: "" },
				token: generateToken({ payload: user._id }),
			});
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	updateUser: async (req, res) => {
		try {
			const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
			if (!user) return res.status(403).json({ message: "invalid user.." });
			return res.status(200).json({ message: "success", user: { ...user._doc, password: "" } });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	sendFriendRequest: async (req, res) => {
		try {
			const user = await User.findById({ _id: req.user.payload.payload });
			if (!user) return res.status(403).json({ message: "User doesnot found" });
			if (user._id.toString() === req.params.id)
				return res.status(403).json({ message: "You can't send friend request yourself" });

			if (user.requestSendList.includes(req.params.id))
				return res.status(200).json({ message: "You have already send friend request" });

			const [updatedSenderProfile, updatedReceiverProfile] = await Promise.all([
				User.findByIdAndUpdate(
					{ _id: req.user.payload.payload },
					{ $push: { requestSendList: req.params.id } },
					{ new: true }
				),
				User.findByIdAndUpdate(req.params.id, { $push: { acceptPendingList: req.user.payload.payload } }, { new: true }),
			]);

			return res.status(200).json({ message: "success", updatedReceiverProfile, updatedSenderProfile });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	cancelRequest: async (req, res) => {
		try {
			const user = await User.findById({ _id: req.user.payload.payload });
			if (!user) return res.status(403).json({ message: "user not found" });
			if (user._id.toString() === req.params.id) return res.status(403).json({ message: "You can't cancel yourself" });

			if (!user.requestSendList.includes(req.params.id))
				return res.status(403).json({ message: "You have not send request to this user " });

			const [updatedSenderProfile, updatedReceiverProfile] = await Promise.all([
				User.findByIdAndUpdate(
					{ _id: req.user.payload.payload },
					{ $pull: { requestSendList: req.params.id } },
					{ new: true }
				),
				User.findByIdAndUpdate(req.params.id, { $pull: { acceptPendingList: req.user.payload.payload } }, { new: true }),
			]);

			return res.status(200).json({ message: "success", updatedReceiverProfile, updatedSenderProfile });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	acceptRequest: async (req, res) => {
		try {
			const user = await User.findById({ _id: req.user.payload.payload });
			if (!user) return res.status(403).json({ message: "no user found" });
			if (user._id.toString() === req.params.id) return res.status(403).json({ message: "You can't accept Yourself" });
			if (!user.acceptPendingList.includes(req.params.id))
				return res.status({ message: "Sorry you don't have got any request" });
			const [acceptRequest, senderBeingFriend] = await Promise.all([
				User.findByIdAndUpdate(
					{ _id: req.user.payload.payload },
					{ $pull: { acceptPendingList: req.params.id }, $push: { friendList: req.params.id } },
					{ new: true }
				),
				User.findByIdAndUpdate(
					req.params.id,
					{ $pull: { requestSendList: req.user.payload.payload }, $push: { friendList: req.user.payload.payload } },
					{ new: true }
				),
			]);

			return res.status(200).json({ message: "success", acceptRequest, senderBeingFriend });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	unFriendUser: async (req, res) => {
		try {
			const user = await User.findById({ _id: req.user.payload.payload });
			if (!user) return res.status(403).json({ message: "no user found" });
			if (user._id.toString() === req.params.id) return res.status(403).json({ message: "You can't unfriend Yourself" });
			if (!user.friendList.includes(req.params.id))
				return res.status(403).json({ message: "You are not friend yet with this user" });

			const [unfriendUser, gettingUnfriend] = await Promise.all([
				User.findByIdAndUpdate({ _id: req.user.payload.payload }, { $pull: { friendList: req.params.id } }, { new: true }),
				User.findByIdAndUpdate(req.params.id, { $pull: { friendList: req.user.payload.payload } }, { new: true }),
			]);
			console.log(unfriendUser);
			return res.status(200).json({ message: "success", unfriendUser, gettingUnfriend });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
	deleteRequest: async (req, res) => {
		try {
			const user = await User.findById({ _id: req.user.payload.payload });
			if (!user) return res.status(403).json({ message: "No user found" });
			if (user._id.toString() === req.params.id) return res.status(403).json({ message: "You can't delete yourself" });
			if (!user.acceptPendingList.includes(req.params.id))
				return res.status(403).json({ message: "You do not have request to delete it" });

			const [deleteAcceptPending, removeFromSenderList] = await Promise.all([
				User.findByIdAndUpdate(
					{ _id: req.user.payload.payload },
					{ $pull: { acceptPendingList: req.params.id } },
					{ new: true }
				),
				User.findByIdAndUpdate(req.params.id, { $pull: { requestSendList: req.user.payload.payload } }, { new: true }),
			]);
			return res.status(200).json({ message: "success", deleteAcceptPending, removeFromSenderList });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
};

module.exports = userController;

const generateToken = (payload) => {
	return jwt.sign({ payload }, "somethingsecretforjwt", { expiresIn: "30d" });
};
