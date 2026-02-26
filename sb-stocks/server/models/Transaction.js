const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// Auto-calculate total before saving
transactionSchema.pre('save', function (next) {
  this.total = this.price * this.quantity;
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
