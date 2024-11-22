import Database from "../Database/index.js" ; 

export function enrollUserInCourse(userId, courseId) {
    const { enrollments } = Database;
    const enrollment = { 
        _id: Date.now().toString(),
        user: userId, 
        course: courseId,
        date: new Date().toISOString()
    };
    enrollments.push(enrollment);
    return enrollment;
}

export function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = Database;
    Database.enrollments = enrollments.filter(
        (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
    );
}

export function findCoursesByUser(userId) {
    const { enrollments } = Database;
    return enrollments.filter((enrollment) => enrollment.user === userId);
}

export function findUsersByCourse(courseId) {
    const { enrollments } = Database;
    return enrollments.filter((enrollment) => enrollment.course === courseId);
}