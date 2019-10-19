const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

// post method to creat new user
router.post('/signup', UserController.User_SignUp);
//post method to login
router.post('/login', UserController.User_Login);
//delete method to delete exist user
router.delete('/setting/delete', checkAuth, UserController.User_Deleting);
//put method to update exist user password
router.put(
  '/setting/changepassword',
  checkAuth,
  UserController.User_Updating_password
);
//put method to update exist user name
router.put('/setting/changename', checkAuth, UserController.User_Updating_name);
//get method to go profile
router.get('/profile', checkAuth, UserController.User_profile);
// post method about follow
router.post('/follow', checkAuth, UserController.User_follow);
// get method about unfollow
router.post('/unfollow', checkAuth, UserController.User_unfollow);
//post method about adding image to user
router.post('/avatar', checkAuth, UserController.avatar);
//get method about view list of following
router.get('/following', checkAuth, UserController.following);
//get method about view list of followed
router.get('/followers', checkAuth, UserController.followers);

module.exports = router;
