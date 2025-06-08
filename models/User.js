// Import mongoose để tạo schema
const mongoose = require('mongoose');

// Schema cho bảng user
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  address: { type: String },
  identity: { type: String },
  dob: { type: Date },
  isDeleted: { type: Boolean, default: false },
  role: { type: String, enum: ['STUDENT', 'TEACHER', 'ADMIN'], default: 'TEACHER' }
});

module.exports = mongoose.model('User', userSchema);
