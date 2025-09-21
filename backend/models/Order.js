const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  school_id: {
    type: String,
    required: true,
  },
  trustee_id: {
    type: String,
    required: true,
  },
  student_info: {
    name: { type: String, required: true },
    id: { type: String, required: true },
    email: { type: String, required: true },
  },
  gateway_name: {
    type: String,
  },
  custom_order_id: { // For tracking before payment gateway response
    type: String,
    required: true,
    unique: true,
  },
  order_amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);