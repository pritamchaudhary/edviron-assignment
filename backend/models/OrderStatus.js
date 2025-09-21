const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
  collect_id: { // This will be the _id from the Order schema
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  custom_order_id: {
    type: String,
    required: true
  },
  order_amount: { type: Number },
  transaction_amount: { type: Number },
  payment_mode: { type: String },
  payment_details: { type: String },
  bank_reference: { type: String },
  payment_message: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending',
  },
  error_message: { type: String },
  payment_time: { type: Date },
}, {
  timestamps: true
});

module.exports = mongoose.model('OrderStatus', orderStatusSchema);