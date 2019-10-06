const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user');



//sign up
exports.User_SignUp = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(email => {
            if (email) {
                console.log("faild");
                res.status(509).json({ message: "email is exist" })

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
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({ message: "user created" });
                            }).catch(err => {
                                console.log(err);
                                res.status(500).json({ error: err });
                            });
                    }
                });
            }
        });
}


//user login
exports.User_Login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({ message: "Auth Failed" });
                    }
                    if (result) {
                        const token = jwt.sign({
                            userId: user[0]._id
                            //validation of token
                        }, 'secretasshit', {
                                expiresIn: "1d"
                            });
                        return res.status(200).json({ message: "Auth successful", token: token, ID: user[0]._id });
                    }
                    return res.status(401).json({ message: "Auth Failed" });
                })

            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


//adding image to user
exports.avatar = (req, res, next) => {
    const userId = req.body.id;
    User.findOneAndUpdate({ _id: userId }, { avatar: req.body.image })
        .exec()
    User.findOne({ _id: userId })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: "photo is added" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });

        })
}


//user upadting name
exports.User_Updating_name = (req, res, next) => {
    const userId = req.body.id
    User.findOneAndUpdate({ _id: userId }, { name: req.body.name })
        .exec()
    User.findOne({ _id: userId })
        .then(doc => {
            console.log(doc)
            res.status(200).json({ message: "name changed successfully" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


//user updating password
exports.User_Updating_password = (req, res, next) => {
    const userId = req.body.id
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            User.findOneAndUpdate({ _id: userId }, { password: hash })
                .exec()
                .then(result => {
                    User.findOne({ _id: userId })
                    console.log(result);
                    res.status(200).json({ message: "password changed" });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        }
    });
}


//user profile
exports.User_profile = (req, res, next) => {
    const id = req.query.id
    User.findOne({ _id: id })
        .populate("post", 'content likes comment')
        .populate("event", 'name location date')
        .then((result) => {
            console.log(typeof (result));
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
            console.log(err);
            console.log(id);
            res.status(500).json({ error: err });
        });
}


// get following list
exports.following = (req, res, next) => {
    const userId = req.query.id;
    User.findOne({ _id: userId })
        .populate("following", 'name ')
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({ result: result.following })

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}


//get followed list
exports.followers = (req, res, next) => {
    const userId = req.query.id;
    User.findOne({ _id: userId })
        .populate("followers", "name")
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({ result: result.followers });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}


// follow section  
exports.User_follow = (req, res, next) => {
    const userA = req.body.id;
    const userB = req.body.followId;
    User.findOne({ _id: userB })
        .then(result => {
            if (result.followers.indexOf(userA) === -1) {
                result.followers.push(userA);
                result.save();
            }
        })
    User.findOne({ _id: userA })
        .then(doc => {
            if (doc.following.indexOf(userB) === -1) {
                doc.following.push(userB);
                doc.save();
            }
            return res.status(200).json({ doc })
        })

        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}


//unfollow section
exports.User_unfollow = (req, res, next) => {
    const userA = req.body.id;
    const userB = req.body.unfollowId;
    User.findOne({ _id: userB })
        .then(result => {
            if (result.followers.indexOf(userA) !== -1) {
                result.followers.remove(userA);
                result.save();
            }
        })
    User.findOne({ _id: userA })
        .then(doc => {
            if (doc.following.indexOf(userB) !== -1) {
                doc.following.remove(userB);
                doc.save();
            }
            return res.status(200).json({ doc })
        })

        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}


//simple  search section 
exports.Search = (req, res, next) => {
    const name = req.body.name;
    User.findOne({ name: name })
        .then(result => {
            if (result !== null) {
                res.status(200).json({ result });
            } else {
                res.status(404).json({ message: "Not Found" })
            }
        })
        .catch(err => {
            res.status(500).json({ Error: err })
        })
}


//user deleting
exports.User_Deleting = (req, res, next) => {
    User.findOneAndDelete({ _id: req.query.id })
        .exec()
        .then(() => {
            res.status(200).json({ message: "user deleted" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
}