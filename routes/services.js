const express = require('express');
const Vendor = require('../models/vendor');
const router = express.Router();

// Route to display services
router.get('/services', async (req, res) => {
  const services = await Vendor.find({}).select('name services experience contact');
  res.render('services', {
    services,
    title: 'Available Services',
    req, // Pass the req object to the EJS template
  });
});

module.exports = router;
