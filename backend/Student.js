const mongoose = require("mongoose");

// Blueprint: what a student looks like
const studentSchema = new mongoose.Schema({
  name: String,
  admissionNumber: String,
  address: String,
  branch: String,
  isDeleted:{
    type:Boolean,
    default:false
  }
});

// Model: like a machine that creates students in the database
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
