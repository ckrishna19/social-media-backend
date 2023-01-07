const Post = require("../controllers/postController");
const router = require("express").Router();

router.post("/new", Post.createPost);
router.patch("/:id/update", Post.updatePost);
router.delete("/:id", Post.deletePost);
router.post("/:id/like", Post.likePost);
router.post("/:id/unLike", Post.unLikePost);
router.get("/:id/single", Post.getAllPostBySingleUser);
router.get("/:id", Post.getSinglePost);
router.get("/all", Post.getAllPost);

module.exports = router;
