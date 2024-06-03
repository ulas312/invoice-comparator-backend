import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  items: [
    {
      productDescription: String,
      unit: String,
      price: Number,
    },
  ],
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
