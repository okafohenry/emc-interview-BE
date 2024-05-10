const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, 'Please A Valid Password is Required'],
      select: false
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Please enter a User Name']
    },
    image: {
      type: String,
      default: (doc) => {
        return 'https://api.dicebear.com/8.x/initials/svg?seed=' + doc.username;
      }
    }
  },
  {
    timestamps: true
  }
);
// Encrypt password using Bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      user_id: this._id
    },
    process.env.JWT_SECRET
  );
};

module.exports = mongoose.model('Users', userSchema);
