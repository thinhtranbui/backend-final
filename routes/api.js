// Import các module cần thiết
const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const TeacherPosition = require('../models/TeacherPosition');

// Hàm sinh mã ngẫu nhiên 10 chữ số
const generateCode = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// GET /teachers - Lấy danh sách giáo viên với phân trang
router.get('/teachers', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const teachers = await Teacher.find({ isDeleted: false })
      .populate('userId', 'name email phoneNumber address')
      .populate('teacherPositions', 'name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Teacher.countDocuments({ isDeleted: false });

    const formattedTeachers = teachers.map((teacher) => ({
      code: teacher.code,
      name: teacher.userId.name,
      email: teacher.userId.email,
      phoneNumber: teacher.userId.phoneNumber,
      address: teacher.userId.address,
      isActive: teacher.isActive,
      positions: teacher.teacherPositions.map((pos) => pos.name),
      degrees: teacher.degrees.map((deg) => ({
        type: deg.type,
        school: deg.school
      }))
    }));

    res.json({
      success: true,
      data: formattedTeachers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /teachers - Tạo giáo viên mới
router.post('/teachers', async (req, res) => {
  try {
    const { name, email, phoneNumber, address, identity, dob, degrees, startDate, teacherPositions } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    // Tạo user mới
    const user = new User({
      name,
      email,
      phoneNumber,
      address,
      identity,
      dob,
      role: 'TEACHER'
    });
    await user.save();

    // Sinh mã giáo viên duy nhất
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = generateCode();
      const existingTeacher = await Teacher.findOne({ code });
      if (!existingTeacher) isUnique = true;
    }

    // Tạo teacher mới
    const teacher = new Teacher({
      userId: user._id,
      code,
      startDate,
      teacherPositions,
      degrees
    });
    await teacher.save();

    res.status(201).json({ success: true, message: 'Tạo giáo viên thành công', data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /teacher-positions - Lấy danh sách vị trí công tác
router.get('/teacher-positions', async (req, res) => {
  try {
    const positions = await TeacherPosition.find({ isDeleted: false });
    res.json({ success: true, data: positions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /teacher-positions - Tạo vị trí công tác mới
router.post('/teacher-positions', async (req, res) => {
  try {
    const { name, des, isActive } = req.body;

    // Sinh mã vị trí duy nhất
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = generateCode();
      const existingPosition = await TeacherPosition.findOne({ code });
      if (!existingPosition) isUnique = true;
    }

    const position = new TeacherPosition({
      name,
      code,
      des,
      isActive
    });
    await position.save();

    res.status(201).json({ success: true, message: 'Tạo vị trí công tác thành công', data: position });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;