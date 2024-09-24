const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const SignUp = require('../src/models/signUp');


const router = express.Router();
router.use(cookieParser());
router.use(express.json());

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new SignUp({ name, email, password });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    next(error);
  }
});

router.post('/login', (req, res) => {
  const token = req.cookies.token;

  if (token) {
    // Verify if the existing token is valid
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // If the token is invalid or expired, proceed with the login process
        loginUser(req, res);
      } else {
        // If the token is valid, respond with a message that the user is already logged in
        res.status(200).send('You are already logged in');
      }
    });
  } else {
    // If there is no token, proceed with the login process
    loginUser(req, res);
  }
});

const loginUser = async(req, res,next) => {
  const { email, password } = req.body;
  try {
    const { email, password } = req.body;
    const user = await SignUp.findOne({ email });
    if (user && await user.comparePassword(password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    next(error);
  }
};


//logout

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).send('Logged out successfully');
});


module.exports = router;