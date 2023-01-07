const auth = require("../controllers/auth");
const messageController = require("../controllers/messageController");
const router = require("express").Router();

router.post("/new", messageController.writeMessage);

router.patch("/:id", messageController.updateMessage);

router.delete("/:id", messageController.deleteMessage);
module.exports = router;
