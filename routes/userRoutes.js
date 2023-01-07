const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../controllers/auth");
const router = express.Router();

// routers for event handellers
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.patch("/:id", auth, userController.updateUser);
router.patch("/:id/sendRequest", auth, userController.sendFriendRequest);
router.get("/all", userController.getAllUser);
router.patch("/:id/cancelRequest", auth, userController.cancelRequest);
router.patch("/:id/acceptRequest", auth, userController.acceptRequest);
router.patch("/:id/unFriendUser", auth, userController.unFriendUser);
router.patch("/:id/deleteRequest", auth, userController.deleteRequest);

module.exports = router;
