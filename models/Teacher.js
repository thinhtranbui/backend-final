// Import mongoose để tạo schema
const mongoose = require('mongoose');

// Schema cho bảng teacher
const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  code: { type: String, required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  teacherPositions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TeacherPosition' }],
  degrees: [
    {
      type: { type: String, required: true },
      school: { type: String, required: true },
      major: { type: String, required: true },
      year: { type: Number, required: true },
      isGraduated: { type: Boolean, default: true }
    }
  ]
});

module.exports = mongoose.model('Teacher', teacherSchema);

