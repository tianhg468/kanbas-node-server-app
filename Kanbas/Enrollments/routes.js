import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    // Get user's enrollments
    app.get("/api/users/:userId/courses", async (req, res) => {
        const { userId } = req.params;
        try {
            const enrollments = await dao.findCoursesByUser(userId);
            console.log("Found enrollments for user:", userId, enrollments); // Debug log
            res.json(enrollments);
        } catch (error) {
            console.error("Error finding enrollments:", error);
            res.status(500).json({ message: "Error finding enrollments" });
        }
    });

    // Enroll in a course
    app.post("/api/users/:userId/courses/:courseId", async (req, res) => {
        const { userId, courseId } = req.params;
        try {
            const enrollment = await dao.enrollUserInCourse(userId, courseId);
            console.log("Created enrollment:", enrollment); // Debug log
            res.json(enrollment);
        } catch (error) {
            console.error("Error creating enrollment:", error);
            res.status(500).json({ message: "Error creating enrollment" });
        }
    });

    // Unenroll from a course
    app.delete("/api/users/:userId/courses/:courseId", async (req, res) => {
        const { userId, courseId } = req.params;
        try {
            await dao.unenrollUserFromCourse(userId, courseId);
            res.json({ message: "Successfully unenrolled" });
        } catch (error) {
            console.error("Error deleting enrollment:", error);
            res.status(500).json({ message: "Error deleting enrollment" });
        }
    });
}