import mongoose from "mongoose" ; 

const assignmentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  course: { type: String },
  points: { type: Number },
  dueDate: { type: String },
  availableFrom: { type: String },
  availableUntil: { type: String }
},
{ collection: "assignments" } 
);

export default assignmentSchema;


