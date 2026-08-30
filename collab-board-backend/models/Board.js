const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: ''
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Prevent duplicate users inside members array
boardSchema.path('members').validate(function (members) {
  const ids = members.map((member) => member.toString());
  return ids.length === new Set(ids).size;
}, 'Board members must be unique');

module.exports = mongoose.model('Board', boardSchema);

