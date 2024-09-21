const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Vendor = require('../models/vendor');
const router = express.Router();

// User Registration
router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    req.flash('error', 'User already exists');
    return res.redirect('/register');
  }
  user = new User({ name, email, password: await bcrypt.hash(password, 10) });
  await user.save();
  req.flash('success', 'Registration successful');
  res.redirect('/login');
});

// User Login
router.get('/login', (req, res) => res.render('login'));
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/login');
  }
  req.session.user = user;
  res.redirect('/');
});

// Vendor Registration
router.get('/vendor/register', (req, res) => res.render('vendor_register'));
router.post('/vendor/register', async (req, res) => {
  const { name, email, password, services, experience, contact } = req.body;
  let vendor = await Vendor.findOne({ email });
  if (vendor) {
    req.flash('error', 'Vendor already exists');
    return res.redirect('/vendor/register');
  }
  vendor = new Vendor({ name, email, password: await bcrypt.hash(password, 10), services, experience, contact });
  await vendor.save();
  req.flash('success', 'Vendor registration successful');
  res.redirect('/vendor/login');
});

// Vendor Login
router.get('/vendor/login', (req, res) => res.render('vendor_login'));
router.post('/vendor/login', async (req, res) => {
  const { email, password } = req.body;
  const vendor = await Vendor.findOne({ email });
  if (!vendor || !await bcrypt.compare(password, vendor.password)) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/vendor/login');
  }
  req.session.vendor = vendor;
  res.redirect('/vendor/dashboard');
});

module.exports = router;
