const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'Frontend Developer',
      trim: true,
    },

    status: {
      type: String,
      enum: ['Online', 'Offline', 'Away'],
      default: 'Offline',
    },

    joined: {
      type: String,
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      default: '',
      trim: true,
    },

    location: {
      type: String,
      default: '',
      trim: true,
    },

    website: {
      type: String,
      default: '',
      trim: true,
    },

    resetPinHash: {
      type: String,
      default: null,
      select: false,
    },

    resetPinExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    resetPinAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// HASH PASSWORD BEFORE SAVE
// ============================================================
userSchema.pre('save', async function () {
  // Password has not changed
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

module.exports = mongoose.model('User', userSchema);
