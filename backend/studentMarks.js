const mongoose = require("mongoose");

// Blueprint: what a studentMarks looks like
const studentMarksSchema = new mongoose.Schema({
  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student",
    required:true
  },
  subject:{
    type:String,
    required:true
  },
  marks:{
    type:Number,
    required:true
  }
});

// Model: like a machine that creates studentMarks in the database
const studentMarks = mongoose.model("student_marks", studentMarksSchema);

module.exports = studentMarks;