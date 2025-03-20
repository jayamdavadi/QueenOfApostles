const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ },
  message: { type: String, required: true, trim: true, minlength: 10 },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;