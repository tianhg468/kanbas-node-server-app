import * as assignmentDao from "./dao.js";

export default function AssignmentRoutes(app) {
   
    // Retrieve assignments for a specific course
    app.get("/api/courses/:courseId/assignments", async (req, res) => {
        const { courseId } = req.params;
        const assignments = await assignmentDao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    });

    // Create a new assignment
    app.post("/api/courses/:courseId/assignments", async (req, res) => {
        const { courseId } = req.params;
        const assignment = { ...req.body, course: courseId };
        const newAssignment = await assignmentDao.createAssignment(assignment);
        res.status(201).json(newAssignment);
    });

    // Update an existing assignment
    app.put("/api/courses/:courseId/assignments/:assignmentId", async (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const updatedAssignment = await assignmentDao.updateAssignment(assignmentId, assignmentUpdates);
        if (updatedAssignment) {
            res.json(updatedAssignment);
        } else {
            res.status(404).send({ error: "Assignment not found" });
        }
    });

    // Delete an assignment
    app.delete("/api/courses/:courseId/assignments/:assignmentId", async (req, res) => {
        const { assignmentId } = req.params;
        const success = await assignmentDao.deleteAssignment(assignmentId);
        if (success) {
            res.sendStatus(204); 
        } else {
            res.status(404).send({ error: "Assignment not found" });
        }
    });
}
