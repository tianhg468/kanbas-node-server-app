import Database from "../Database/index.js" ; 

export function findAllAssignments() {
    return Database.assignments;
}

export function findAssignmentsForCourse(courseId) {
    return Database.assignments.filter((assignment) => assignment.course === courseId);
}

export function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: Date.now().toString() };
    Database.assignments = [...Database.assignments, newAssignment];
    return newAssignment;
}

export function updateAssignment(assignmentId, assignmentUpdates) {
    const assignment = Database.assignments.find((a) => a._id === assignmentId);
    if (assignment) {
        Object.assign(assignment, assignmentUpdates);
        return assignment;
    }
    return null;
}

export function deleteAssignment(assignmentId) {
    const originalLength = Database.assignments.length;
    Database.assignments = Database.assignments.filter((a) => a._id !== assignmentId);
    return Database.assignments.length < originalLength; // Return true if an assignment was deleted
}