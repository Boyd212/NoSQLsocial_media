const router = require("express").Router();
const {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    delteComment,
    addReaction,
    removeReaction,
} = require("../../controllers/comment-controller");

router.route("/").get(getAllComments).post(createComment);
router.route("/:id").get(getCommentById).put(updateComment).delete(delteComment);
router.route("/:commentId/reactions").post(addReaction);
router.route("/:commentId/reactions/:reactionId").delete(removeReaction);

module.exports = router;