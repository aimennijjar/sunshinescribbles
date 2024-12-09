// routes/posts.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const middleware = require("../middleware");

router.get("/", (req, res) => {
  Post.find({}, (err, allposts) => {
    if (err) {
      console.log("Error in find");
      console.log(err);
    } else {
      res.render("posts/index", {
        posts: allposts.reverse(),
        currentUser: req.user,
      });
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var imageUrl = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };

  var newPost = {
    name: name,
    image: imageUrl,
    description: desc,
    author: author,
  };
  Post.create(newPost, (err) => {
    if (err) {
      console.log("Error in inserting into DB");
    } else {
      res.redirect("/posts");
    }
  });
});

router.get("/publish", middleware.isLoggedIn, (req, res) => {
  res.render("posts/new");
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("comments")
    .exec((err, foundPost) => {
      if (err) {
        console.log("Error occurced in finding ID");
      } else {
        res.render("posts/show", { post: foundPost });
      }
    });
});

router.get("/:id/edit", middleware.checkPostOwnership, (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    res.render("posts/edit", { post: foundPost });
  });
});

router.put("/:id", middleware.checkPostOwnership, (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body.post, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/posts/" + req.params.id);
    }
  });
});

router.delete("/:id", middleware.checkPostOwnership, (req, res) => {
  Post.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/posts");
    } else {
      res.redirect("/posts");
    }
  });
});

module.exports = router;
