const commentController = require("../controllers/commentController");

const router = require("express").Router();

router.post("/new", commentController.writeComment);

module.exports = router;
