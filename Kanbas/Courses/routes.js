import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function CourseRoutes(app) {
    const createCourse = (req, res) => {
        const newCourse = dao.createCourse(req.body);
        res.send(newCourse);
    };

    const findAllCourses = (req, res) => {
        const courses = dao.findAllCourses();
        res.send(courses);
    };

    const findCourseById = (req, res) => {
        const { courseId } = req.params;
        const course = dao.findCourseById(courseId);
        res.send(course);
    };

    const updateCourse = (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    };

    const deleteCourse = (req, res) => {
        const { courseId } = req.params;
        const status = dao.deleteCourse(courseId);
        res.send(status);
    };

    const findModulesForCourse = (req, res) => {
        const { courseId } = req.params;
        const modules = modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    };

    const createModule = (req, res) => {
        const { courseId } = req.params;
        const module = { ...req.body, course: courseId };
        const newModule = modulesDao.createModule(module);
        res.send(newModule);
    };

    app.post("/api/courses", createCourse);
    app.get("/api/courses", findAllCourses);
    app.get("/api/courses/:courseId", findCourseById);
    app.put("/api/courses/:courseId", updateCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.get("/api/courses/:courseId/modules", findModulesForCourse);
    app.post("/api/courses/:courseId/modules", createModule);
}

// import * as dao from "./dao.js" ; 
// import * as modulesDao from "../Modules/dao.js" ;

// export default function CourseRoutes(app) { 
//     app.get( "/api/courses" , (req, res) => { 
//         const courses = dao.findAllCourses(); 
//         res.send(courses); 
//     }); 
//     app.delete( "/api/courses/:courseId" , (req, res) => { 
//         const { courseId } = req.params; 
//         const status = dao.deleteCourse(courseId); 
//         res.send(status); 
//     });
   
//     app.put( "/api/courses/:courseId" , (req, res) => { 
//         const { courseId } = req.params; 
//         const courseUpdates = req.body; 
//         const status = dao.updateCourse(courseId, courseUpdates); 
//         res.send(status); 
//     });
//     app.get( "/api/courses/:courseId/modules" , (req, res) => { 
//         const { courseId } = req.params; 
//         const modules = modulesDao.findModulesForCourse(courseId); 
//         res.json(modules); 
//     });
//     app.post( "/api/courses/:courseId/modules" , (req, res) => { 
//         const { courseId } = req.params; 
//         const module = { ...req.body, course: courseId, }; 
//         const newModule = modulesDao.createModule(module); 
//         res.send(newModule); 
//     });
// }