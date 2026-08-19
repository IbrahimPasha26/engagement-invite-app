import mongoose from 'mongoose';

const RsvpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  attendance: { type: String, required: true, enum: ['Joyfully Accepts', 'Regretfully Declines'] },
  guestsCount: { type: Number, default: 1 },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.RSVP || mongoose.model('RSVP', RsvpSchema);