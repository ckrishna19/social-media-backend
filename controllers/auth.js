const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
	try {
		const token = req.header("Authorization");
		if (!token) return res.status(403).json({ message: "No token found please login first" });
		if (token.expries) return res.status(403).json({ message: "invalid authentication reset token expired..", success: false });
		if (!token) return res.status(403).json({ message: "invalid authentication reset token expired..", success: false });
		jwt.verify(token, "somethingsecretforjwt", (err, user) => {
			if (err) return res.status(403).json({ message: "Invalid authentication", success: false });
			if (!user) return res.status(403).json({ message: "invalid authentication", success: false });
			req.user = user;
			next();
		});
	} catch (error) {
		return res.status(500).json({ message: error.message, success: false });
	}
};

module.exports = auth;
