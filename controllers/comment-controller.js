const { Comment, User } = require("../models");

const commentController = {
    getAllComments(req, res) {
        Comment.find({})
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 })
        .then((dbCommentData) => res.json(dbCommentData))
        .catch((err) => {
        res.sendStatus(400);
    });
},

    getCommentById({ params }, res) {
        Comment.findOne({ _id: params.id })
        .populate({
        path: "reactions",
        select: "-__v",
        })
        .select("-__v")
        .then((dbCommentData) => {
        if (!dbCommentData) {
            return res.status(404).json({ message: "No comment with this id!" });
        }
        res.json(dbCommentData);
        })
        .catch((err) => {
        console.log(err);
        res.sendStatus(400);
        });
},

createComment({ params, body }, res) {
    Comment.create(body)
    .then(({ _id }) => {
        return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { comments: _id } },
            { new: true }
        );
    })
    .then((dbUserData) => {
        if (!dbUserData) {
            return res
            .status(404)
            .json({ message: "Comment created but there is no User with this id" });
        }
        res.json({ message: "Comment successfully added"});
    })
    .catch((err) => res.json(err));
},

updateComment({ params, body }, res) {
    Comment.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
    })
    .then((dbCommentData) => {
        if (!dbCommentData) {
            res.status(404).json({ message: "No comment with this ID" });
            return;
        }
        res.json(dbCommentData);
    })
    .catch((err) => res.json(err));
},

deleteComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.id })
    .then((dbCommentData) => {
        if (!dbCommentData) {
            return res.status(404).json({ message: "No comment with this ID"});
        }
        return User.findOneAndUpdate(
            { comments: params.id },
            { $pull: { comments: params.id } },
            { new: true }
        );
    })
    .then((dbUserData) => {
        if (!dbUserData) {
            return res
            .status(404)
            .json({ message: "No User with this ID" });
        }
        res.json({ message: "Comment deleted" });
    })
    .catch((err) => res.json(err));
},

addReaction({ params, body }, res) {
    Comment.findOneAndUpdate(
        { _id: params.commentId },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
    )
    .then((dbCommentData) => {
        if (!dbCommentData) {
            res.status(404).json({ message: "No comment with this ID" });
            return; 
        }
        res.json(dbCommentData);
    })
    .catch((err) => res.json(err));
},

removeReaction({ params }, res) {
    Comment.findOneAndUpdate(
        { _id: params.commentId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
    )
    .then((dbCommentData) => res.json(dbCommentData)) 
    .catch((err) => res.json(err));
},
};

module.exports = Comment;