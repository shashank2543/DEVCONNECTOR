const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// @route GET api/auth
// @desc  Test route
// @access PUBLIC
router.get('/', auth, async (req, res) => {
  //res.send('Auth route');
  try {
    const user = await User.findById(req.user.id).select('-password ');
    return  res.json(user);
  } catch (error) {
   // console.log(error.message);
   return  res.status(500).send('server error ');
  }
});

// @route  POST api/users
// @desc   Register user
// @access Public
router.post(
  '/',
  [
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.body);
    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
     // console.log(user)
      if (!user) {
        return res.status(400).json({ errors: ['Invalid Credentials'] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
     // console.log(isMatch)
      if (!isMatch) {
        return res.status(400).json({ errors: ['Invalid Credentials'] });
      }
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      // res.send('User registered ');
    } catch (error) {
      console.log(error);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
