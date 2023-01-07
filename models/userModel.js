const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, unique: true, lowercase: true },
	password: { type: String },
	friendList: [],
	requestSendList: [],
	acceptPendingList: [],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
