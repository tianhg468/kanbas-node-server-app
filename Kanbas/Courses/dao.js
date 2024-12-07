import model from "./model.js" ;
import enrollmentModel from "../Enrollments/model.js"; 

export function findAllCourses () { 
    return model.find();
}

export async function findCoursesForEnrolledUser(userId) { 
    const enrolledCourses = await model.find({
        '_id': {
            $in: await enrollmentModel.find({ user: userId }).distinct('course')
        }
    });
    return enrolledCourses;
}

export function createCourse(course) { 
    delete course._id; 
    return model.create(course);
}

export function deleteCourse(courseId) { 
    return model.deleteOne({ _id: courseId });
}

export function updateCourse(courseId, courseUpdates) { 
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}