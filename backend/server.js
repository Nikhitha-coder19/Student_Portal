const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const Student = require("./Student");
const studentMarks=require("./studentMarks");

// 🔌 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.log("❌ MongoDB connection error:", err));

// A test route
app.get("/", (req, res) => {
  res.send("✅ Backend and MongoDB are working!");
});

// Student Details
app.post("/students", async (req, res) => {
  try {
    const { name, admissionNumber, address, branch } = req.body;

    const newStudent = new Student({ name, admissionNumber, address, branch });
    await newStudent.save();

    res.status(201).json({ message: "Student added", student: newStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: false });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
});
app.put("/students/:id/delete", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Student soft-deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});
app.put("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update student" });
  }
});

// Student Marks
app.post("/grades", async (req, res) => {
  console.log("📥 POST /grades hit with body:", req.body);
  try {
    const { studentId, grades } = req.body;

    for (let grade of grades) {
      await studentMarks.create({
        student: studentId,
        subject: grade.subject,
        marks: grade.marks
      });
    }

    res.json({ message: "Marks added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add marks" });
  }
});
app.get("/grades/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const grades = await studentMarks.find({ student: studentId });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch marks" });
  }
});
app.put("/grades/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { grades } = req.body;

    // 1. Delete existing marks
    await studentMarks.deleteMany({ student: studentId });

    // 2. Add new marks
    for (let grade of grades) {
      await studentMarks.create({
        student: studentId,
        subject: grade.subject,
        marks: grade.marks
      });
    }

    res.json({ message: "Marks updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update marks" });
  }
});
app.delete("/grades/:studentId/:subject", async (req, res) => {
  try {
    const { studentId, subject } = req.params;

    await studentMarks.deleteOne({ student: studentId, subject });

    res.json({ message: "Subject marks deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete subject marks" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});