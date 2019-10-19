const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post');
const checkAuth = require('../middleware/check-auth');

//get method about show all posts in database
router.get('/home', checkAuth, PostController.home);
//get method about show single post
router.get('/home/single', checkAuth, PostController.view_post);
//post method about make new post
router.post('/home/new', checkAuth, PostController.create_post);
//put method about update exist post
router.put('/home/single/edit', checkAuth, PostController.edit_post);
//delete method about delete post
router.delete('/home/single/delete', checkAuth, PostController.delete_post);
//get method about add likes
router.get('/home/like', checkAuth, PostController.like);
//get method about share post
router.post('/home/single/share', checkAuth, PostController.share);

module.exports = router;
