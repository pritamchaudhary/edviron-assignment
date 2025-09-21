const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  // We use the existing ID from the assessment as the _id for easy lookups
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, { _id: false }); // Prevent Mongoose from creating its own _id

module.exports = mongoose.model('School', schoolSchema);