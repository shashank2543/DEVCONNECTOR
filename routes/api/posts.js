const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator/check');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
// @route  POST api/posts
// @desc   Create a post
// @access Public
router.post('/', [auth,[
    check('text',"text is required").not().isEmpty()
]] ,async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            errors: error.array()
        })
        //console.log(error.array());
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
       // console.log(req.user.id)
        //console.log(user)
        const newPost = new Post({
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user.id,
    });
    //console.log(newPost)
    const post = await newPost.save();
    res.json(post)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
    
});
// @route  GET api/posts
// @desc   Get all posts
// @access Private

router.get('/',async (req,res)=>{
    try {
       const posts = await Post.find().sort({date:-1}) ;
       res.json(posts) 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET api/posts/:id
// @desc   Get all posts by id
// @access Private
router.get('/:id',async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post Not Found'});
        }  
        return res.json(post)
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(404).json({msg:"Post not found"});
        }
        console.log(error.message);
        res.status(500).send('Server Error');
    }
    
});

// @route  DELETE api/posts/:id
// @desc   Delete a posts
// @access Private
router.delete('/:id',auth,async(req,res)=>{
    try {
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({ msg:"Post not found"});
    }
    // check user
    if(post.user.toString() !== req.user.id){
        return res.status(401).json({msg:"user not authorised"});
    }
    await post.remove();
    res.json({msg:"Post Removed"});
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(404).json({msg:"Post not found"});
        }
        return res.status(500).send('Server Error');
    }
    
});

// @route  PUT api/posts/like/:id
// @desc   Like a posts
// @access Private
router.put('/like/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post not found"});
        }
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0){
            return  res.status(400).json({msg:"post already liked"})
        }
        post.likes.unshift({user:req.user.id})
      // console.log(post)
        await post.save();
        return res.json(post);
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(404).json({msg:"Post not found"});
        }
        console.error(error.message)
        return res.status(500).send('Server Error');
    }
});

// @route  PUT api/posts/unlike/:id
// @desc   Unlike a posts
// @access Private
router.put('/unlike/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post not found"});
        }
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length === 0){
            return  res.status(400).json({msg:"post not liked by you"})
        }
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex,1);
        //console.log(post)
        await post.save();
        return res.json(post);
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(404).json({msg:"Post not found"});
        }
        console.error(error.message)
        return res.status(500).send('Server Error');
    }
});

// @route  POST api/posts/comment/:id
// @desc   Comment on a post
// @access Private
router.post('/comment/:id', [auth,[
    check('text',"text is required").not().isEmpty()
]] ,async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            errors: error.array()
        })
        //console.log(error.array());
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
       // console.log(req.user.id)     
        //console.log(user)
        const post = await Post.findById(req.params.id)
        const newComment = {
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user.id,
        }
    //console.log(newPost)
    post.comments.unshift(newComment);
    await post.save();
    
    res.json(post)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
    
});

// @route  POST api/posts/comment/:id
// @desc   Delete a comment
// @access Private
router.delete('/comment/:id/:comment_id',auth,async (req,res) =>{
    try {
       // const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment => comment.id.toString() === req.params.comment_id )
        if(!comment){
            return res.status(404).json({
                msg:"comment does not exist"
            })
        }

        // Check User
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({
                msg:'User not authorized'
            });
        }

        const removeIndex =  post.comments && post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id);
        console.log(req.user.id,removeIndex);
        post.comments.splice(removeIndex,1);
        await post.save();
        return res.json(post.comments);
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(404).json({msg:"Post not found"});
        }
        console.error(error.message);
        res.status(500).send("Server Error")
    }
})
module.exports = router;
