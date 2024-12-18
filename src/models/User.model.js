const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
/*
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your name'],
  },
  lastname: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },

  Confirmpassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password are not the same',
    },
  },
  passwordChangeAt: Date,

  
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
Console.log("ses");
  this.password = await bcrypt.hash(this.password, 12);

  this.Confirmpassword = undefined;

  next();
});
UserSchema.pre('save', function (next) {
  if (!this.isModified('password') && this.isNew) {
    return next();
  }

  this.passwordChangeAt = Date.now() - 1000;

  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log('Token from model', hashToken);
  this.passwordResetToken = hashToken;
  this.passwordResetExpires = Date.now() + 10 + 60 * 1000;

  return resetToken;
};*/
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your name'],
  },
  lastname: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
  type: Buffer  // Campo para almacenar la imagen
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  }, birthday: {
    type: Date,
    trim: true,
  },
/*
  Confirmpassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password are not the same',
    },
  },*/
  passwordChangeAt: Date,

  
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
});



const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
