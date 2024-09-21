const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  services: { type: [String], required: true },
  experience: { type: Number, required: true },
  contact: { type: String, required: true },
});

module.exports = mongoose.model('Vendor', vendorSchema);
