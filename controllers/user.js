const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//sign up
exports.User_SignUp = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email }).then(email => {
    if (email) {
      res.status(509).json({ message: 'email is exist' });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err });
        } else {
          const user = new User({
            email: req.body.email,
            password: hash,
            name: req.body.name
          });
          user
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({ message: 'user created' });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({ error: err });
            });
        }
      });
    }
  });
};

//user login
exports.User_Login = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({ message: 'Auth Failed' });
          }
          if (result) {
            const token = jwt.sign(
              {
                userId: user._id.toString() // adding user id into token to use it in requests
              },
              'secretasshit',
              {
                expiresIn: '1d'
              }
            );

            return res.status(200).json({
              message: 'Auth successful',
              token: token,
              ID: user._id.toString()
            });
          }
          return res.status(401).json({ message: 'Auth Failed' });
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//adding image to user
exports.avatar = (req, res, next) => {
  const userId = req.userId;
  const newImage = req.body.image;
  User.findById(userId)
    .then(user => {
      user.avatar = newImage;
      user.save();
    })
    .then(() => {
      res.status(200).json({ message: 'photo is added' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//user upadting name
exports.User_Updating_name = (req, res, next) => {
  const userId = req.userId;
  const newName = req.body.name;
  User.findById(userId)
    .then(user => {
      console.log(user);
      user.name = newName;
      user.save();
    })
    .then(() => {
      res.status(200).json({ message: 'name changed successfully' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//user updating password
exports.User_Updating_password = (req, res, next) => {
  const userId = req.userId;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err });
    } else {
      User.findOneAndUpdate({ _id: userId }, { password: hash })
        .exec()
        .then(() => {
          res.status(200).json({ message: 'password changed' });
        })
        .catch(err => {
          res.status(500).json({ error: err });
        });
    }
  });
};

//user profile
exports.User_profile = (req, res, next) => {
  const id = req.userId;
  User.findOne({ _id: id })
    .then(result => {
      res.status(200).json({
        name: result.name,
        avatar: result.avatar,
        id: result.id,
        post: result.post,
        event: result.event,
        following: result.following,
        followers: result.followers
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// get following list
exports.following = (req, res, next) => {
  const userId = req.query.id;
  User.findOne({ _id: userId })
    .then(result => {
      res.status(200).json({ result: result.following });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//get followers list
exports.followers = (req, res, next) => {
  const userId = req.query.id;
  User.findOne({ _id: userId })
    .then(result => {
      res.status(200).json({ result: result.followers });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// follow section
exports.User_follow = (req, res, next) => {
  const userA = req.body.id;
  const userB = req.body.followId;
  User.findOne({ _id: userB }).then(result => {
    if (result.followers.indexOf(userA) === -1) {
      result.followers.push(userA);
      result.save();
    }
  });
  User.findOne({ _id: userA })
    .then(doc => {
      if (doc.following.indexOf(userB) === -1) {
        doc.following.push(userB);
        doc.save();
      }
      return res.status(200).json({ doc });
    })

    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//unfollow section
exports.User_unfollow = (req, res, next) => {
  const userA = req.body.id;
  const userB = req.body.unfollowId;
  User.findOne({ _id: userB }).then(result => {
    if (result.followers.indexOf(userA) !== -1) {
      result.followers.remove(userA);
      result.save();
    }
  });
  User.findOne({ _id: userA })
    .then(doc => {
      if (doc.following.indexOf(userB) !== -1) {
        doc.following.remove(userB);
        doc.save();
      }
      return res.status(200).json({ doc });
    })

    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//user deleting
exports.User_Deleting = (req, res, next) => {
  User.findOneAndDelete({ _id: req.query.id })
    .exec()
    .then(() => {
      res.status(200).json({ message: 'user deleted' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
