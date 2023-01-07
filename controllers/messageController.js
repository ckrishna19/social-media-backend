const Message = require("../models/messageModel");

const messageController = {
	writeMessage: async (req, res) => {
		try {
			if (req.user.payload !== req.body.senderId) return res.status(403).json({ message: "You can't message" });
			if (req.body.senderId === req.body.receiverId)
				return res.status(403).json({ message: "Sorry you can't message yourself" });
			const newMessage = await Message.create(req.body);
			return res.status(201).json({ message: "success", newMessage });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	updateMessage: async (req, res) => {
		try {
			console.log(req.user.payload, req.body.senderId);
			if (req.user.payload !== req.body.senderId)
				return res.status(403).json({ message: "You do not have permission to edit it" });
			const updatedMessage = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
			return res.status(201).json({ message: "update success", updatedMessage });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	deleteMessage: async (req, res) => {
		try {
			if (req.user.payload !== req.body.senderId)
				return res.status(403).json({ message: "You do not have permission to delete it" });
			const tobeDelete = await Message.findById(req.params.id);
			if (!tobeDelete) return res.status(403).json({ message: "Can't found this document" });
			await tobeDelete.delete();
			return res.status(200).json({ message: "success" });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	getAllMessage: async (req, res) => {
		try {
			const allMessage = await Message.find();
			if (!allMessage) return res.status(200).json({ message: "Message box is empty" });
			return res.status(200).json({ message: "success", allMessage });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},

	getAllPrivateMessage: async (req, res) => {
		try {
			const privateMessage = await Message.find({ _id: req.body.receiverId });
			if (!privateMessage) return res.status(403).json({ message: "sorry the message box is empty" });
			return res.status(201).json({ message: "success", privateMessage });
		} catch (error) {
			return res.status(500).json({ error: "internal server error" });
		}
	},
};

module.exports = messageController;
