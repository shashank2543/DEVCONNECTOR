const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');
// @route   GET api/profile/me
// @desc    GET current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar', 'email']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    return res.json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).send('server error');
  }
});

// @route   POST api/profile
// @desc    Create or update users profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        errors: error.array()
      });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;
    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = req.body.youtube;
    if (twitter) profileFields.social.twitter = req.body.twitter;
    if (facebook) profileFields.social.facebook = req.body.facebook;
    if (linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (instagram) profileFields.social.instagram = req.body.instagram;
    // console.log(profileFields.skills);

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //console.log(profile);
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          {
            user: req.user.id
          },
          { $set: profileFields },
          { new: true }
        );
        res.json(profile);
      } else {
        profile = new Profile(profileFields);
        //  console.log(profile);
        await profile.save();
        res.json(profile);
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
    // res.send('Hello');
  }
);

// @route   GET api/profile
// @desc    GET all users profile
// @access  public

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'email']);
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    //  console.log(req.params.user_id);
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    //console.log(profile);
    if (!profile) {
      return res.status(400).json({
        msg: 'No profile Exits'
      });
    } else {
      res.json(profile);
    }
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({
        msg: 'No profile Exits'
      });
    }
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});
// @route   DELETE api/profile
// @desc    DELETE USER
// @access  public
router.delete('/',auth,async (req,res) => {
  try {
    // @todo  - remove user posts
    // Remove profile
    await Profile.findOneAndDelete({user:req.user.id});
    // Remove User
    await User.findOneAndDelete({_id:req.user.id});
    return res.json({msg:"User removed"});
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
    
  }
});

// @route   PUT  api/profile/experince
// @desc    Add profile experince
// @access  Private
router.put('/experience',[auth,[
  check('title','Title is required').not().isEmpty(),
  check('company','Company is required').not().isEmpty(),
  check('from','From Date is required').not().isEmpty(),
]] ,async(req,res)=>{
  const error = validationResult(req);
  if(!error.isEmpty()){
    return res.status(400).json({error:error.array()});
  }
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    desciption
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    desciption
  }
  try {
    const profile = await Profile.findOne({user:req.user.id});
    profile.experience.unshift(newExp);
    // unshift is just oopposite of push_back
    await profile.save()
    res.json(profile);
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/profile/experience/:exp_id
// @desc  Delete experince from profile
// @access Private
router.delete('/experience/:exp_id',auth, async(req,res) =>{
  try {
    const profile  = await Profile.findOne({user:req.user.id})
    //console.log(profile.experience)
    if(profile){
      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
      console.log(removeIndex)
      if(removeIndex != -1){
        profile.experience.splice(removeIndex,1);
        await profile.save();
        return  res.json(profile);
      }else{
        return res.json({
          msg:"experience id not exists"
        })
      }
    }else{
     return  res.status(400).json({
        msg:"No profile exists"
      })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error');
    
  }
})

// @route   PUT  api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education',[auth,[
  check('school','school is required').not().isEmpty(),
  check('degree','Degree is required').not().isEmpty(),
  check('fieldofstudy','Field Of Study  Date is required').not().isEmpty(),
  check('from','From Date is required').not().isEmpty(),
]] ,async(req,res)=>{
  const error = validationResult(req);
  if(!error.isEmpty()){
    return res.status(400).json({error:error.array()});
  }
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    desciption
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    desciption
  }
  try {
    const profile = await Profile.findOne({user:req.user.id});
    profile.education.unshift(newEdu);
    // unshift is just oopposite of push_back
    await profile.save()
    res.json(profile);
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/profile/education/:edu_id
// @desc  Delete education from profile
// @access Private
router.delete('/education/:edu_id',auth, async(req,res) =>{
  try {
    const profile  = await Profile.findOne({user:req.user.id})
    //console.log(profile.experience)
    if(profile){
      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
     // console.log(removeIndex)
      if(removeIndex != -1){
        profile.education.splice(removeIndex,1);
        await profile.save();
        return  res.json(profile);
      }else{
        return res.json({
          msg:"education id not exists"
        })
      }
    }else{
     return  res.status(400).json({
        msg:"No profile exists"
      })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error');
    
  }
})

module.exports = router;
