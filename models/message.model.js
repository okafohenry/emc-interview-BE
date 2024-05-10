const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
  {
    _user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Users',
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    context: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Messages', MessageSchema);
