import Assignment from "./model.js";
import mongoose from "mongoose" ; 

export function findAllAssignments() {
  return Assignment.find();
}

export function findAssignmentsForCourse(courseId) {
  return Assignment.find({ course: courseId });
}

export function createAssignment(assignment) {
  const newAssignment = new Assignment({
    _id: new mongoose.Types.ObjectId().toHexString(),
    ...assignment,
  });
  return newAssignment.save();
}

export function updateAssignment(assignmentId, assignmentUpdates) {
  return Assignment.findByIdAndUpdate(assignmentId, assignmentUpdates, { new: true });
}

export function deleteAssignment(assignmentId) {
  return Assignment.findByIdAndDelete(assignmentId);
}
