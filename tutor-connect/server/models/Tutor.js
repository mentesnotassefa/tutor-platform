import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjects: [{
    name: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true }
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    yearCompleted: { type: Number }
  }],
  experience: {
    years: { type: Number, default: 0 },
    description: { type: String }
  },
  hourlyRate: { type: Number, required: true },
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    slots: [{
      start: { type: String },
      end: { type: String }
    }]
  }],
  teachingMethods: {
    inPerson: { type: Boolean, default: false },
    online: { type: Boolean, default: false }
  },
  location: {
    address: { type: String },
    city: { type: String },
    country: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  certificationFiles: [{ type: String }],
  profileCompleted: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const Tutor = mongoose.model('Tutor', tutorSchema);
export default Tutor;