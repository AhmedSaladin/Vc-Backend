const Post = require('../models/post');
const User = require('../models/user');

//view all posts about what user follow without testing same problem from events line 7
exports.home = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .then(result => {
      res.status(200).json(result.posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//view single post
exports.view_post = (req, res, next) => {
  const postId = req.query.id;
  Post.findOne({ _id: postId })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//creat new post
exports.create_post = (req, res, next) => {
  const userId = req.userId;
  const post = new Post({
    content: req.body.content,
    likes: 0,
    creator: userId
  });
  User.findOne({ _id: userId })
    .then(result => {
      post.creator = result;
      post.save();
      result.posts.push(post);
      result.save();
      res.status(200).json({ post });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// edit post
exports.edit_post = (req, res, next) => {
  const userId = req.userId;
  const postId = req.body.postId;
  const newContent = req.body.content;
  Post.findOne({ _id: postId })
    .then(result => {
      if (userId == result.creator._id) {
        result.content = newContent;
        result.save();
        res.status(200).json({ message: 'updated' });
      } else {
        res.status(406).json({ message: "you can't update this post" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//post delete
exports.delete_post = (req, res, next) => {
  const userId = req.userId;
  const postId = req.body.postId;
  Post.findOne({ _id: postId })
    .then(result => {
      if (userId == result.creator._id) {
        Post.findOneAndDelete({ _id: postId })
          .then(() => {
            return User.findOne({ _id: userId });
          })
          .then(result => {
            if (result.posts.indexOf(postId) !== -1) {
              result.posts.remove(postId);
              result.save();
              res.status(202).json({ message: 'post deleted successfully' });
            }
          });
      } else {
        res.status(206).json({ message: "you can't delete that" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//post like
exports.like = (req, res, next) => {
  const postId = req.query.id;
  console.log(postId);
  Post.findOne({ _id: postId })
    .then(post => {
      post.likes = post.likes + 1;
      post.save();
      console.log(post);
      res.status(201).json({ post });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ Error: err });
    });
};
exports.share = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.userId;
  User.findOne({ _id: userId })
    .then(result => {
      result.post.push(postId);
      result.save();
      res.status(200).json({ result });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
};
