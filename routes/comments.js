// routes/comments.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { post: post });
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
      res.redirect("/posts");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          post.comments.push(comment);
          post.save();
          res.redirect("/posts/" + post._id);
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        post_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        console.log("here");
        res.redirect("back");
      } else {
        res.redirect("/posts/" + req.params.id);
      }
    }
  );
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("/posts/" + req.params.id);
    } else {
      res.redirect("/posts/" + req.params.id);
    }
  });
});

module.exports = router;
