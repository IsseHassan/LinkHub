import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const clickSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  country: String,
  device: String,
  linkId: mongoose.Schema.Types.ObjectId,
  visitorId: String
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  links: [{
    id: { type: String, required: true },
    title: { type: String },
    url: { type: String },
    shortUrl: { type: String, default: '' },
    clicks: { type: Number, default: 0 },
  }],
  memories: [{
    title: String,
    imageUrl: String,
  }],
  theme: {
    type: String,
    default: 'Default',
  },
  totalClicks: {
    type: Number,
    default: 0,
  },
  clickData: [clickSchema],
  uniqueVisitors: { type: Number, default: 0 },
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    publicProfile: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;