import mongoose from 'mongoose';

const WishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent Mongoose from compiling the model multiple times in Next.js
export default mongoose.models.Wish || mongoose.model('Wish', WishSchema);