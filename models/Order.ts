import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, shipped, delivered
  paymentMethod: { type: String, default: 'cash_on_delivery' },
  address: { type: String, required: true }, // Vulnerability: no validation
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);