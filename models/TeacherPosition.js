// Import mongoose để tạo schema
const mongoose = require('mongoose');

// Schema cho bảng teacherPosition
const teacherPositionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  des: { type: String },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('TeacherPosition', teacherPositionSchema);
