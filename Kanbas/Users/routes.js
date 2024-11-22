import * as dao from "./dao.js" ; 
import * as courseDao from "../Courses/dao.js" ;
import * as enrollmentsDao from "../Enrollments/dao.js" ;

export default function UserRoutes(app) { 
    const createUser = (req, res) => { }; 
    const deleteUser = (req, res) => { }; 
    const findAllUsers = (req, res) => { }; 
    const findUserById = (req, res) => { }; 
    const updateUser = (req, res) => {
        try {
            const userId = req.params.userId;
            const updates = req.body;
            
            const updatedUser = dao.updateUser(userId, updates);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            if (req.session["currentUser"]?._id === userId) {
                req.session["currentUser"] = updatedUser;
            }

            res.json(updatedUser);
        } catch (error) {
            console.error("Update user error:", error);
            res.status(500).json({ message: "Internal server error updating user" });
        }
    };
    const updateProfile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "You must be logged in to update your profile" });
            return;
        }

        // Check if updating username and if it's already taken
        if (req.body.username && req.body.username !== currentUser.username) {
            if (!dao.isUsernameAvailable(req.body.username, currentUser._id)) {
                res.status(400).json({ message: "Username already in use" });
                return;
            }
        }

        // Update the profile using the specific profile update function
        const updatedUser = dao.updateProfile(currentUser._id, req.body);
        if (!updatedUser) {
            res.status(400).json({ message: "Failed to update profile" });
            return;
        }

        // Update session with new user data
        req.session["currentUser"] = updatedUser;
        res.json(updatedUser);
    };

    const signup = (req, res) => {
        try {
            const existingUser = dao.findUserByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).json({ message: "Username already in use" });
            }

            const currentUser = dao.createUser(req.body);
            console.log("New user created:", currentUser); // Debug log

            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } catch (error) {
            console.error("Signup error:", error);
            res.status(500).json({ message: "Internal server error during signup" });
        }
    };
    // const signup = (req, res) => {
    //     const user = dao.findUserByUsername(req.body.username); 
    //     if (user) { 
    //         res.status( 400 ).json( { message: "Username already in use" }); 
    //     return; 
    //     } 
    //     const currentUser = dao.createUser(req.body); 
    //     req.session[ "currentUser" ] = currentUser;
    //     res.json(currentUser); 
    // }; 
    const signin = (req, res) => { 
        const { username, password } = req.body; 
        const currentUser = dao.findUserByCredentials(username, password); 
        if (currentUser) { 
            req.session[ "currentUser" ] = currentUser; 
            res.json(currentUser); 
        } else { 
            res.status(401).json({ message: "Unable to login. Try again later." }); 
        }
    }; 

    const signout = (req, res) => { 
        req.session.destroy();
        res.sendStatus( 200 );
    }; 
    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const userProfile = dao.getUserProfile(currentUser._id);
        if (!userProfile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        res.json(userProfile);
    }; 
    const findCoursesForEnrolledUser = (req, res) => { 
        let { userId } = req.params; 
        if (userId === "current" ) { 
            const currentUser = req.session[ "currentUser" ]; 
            if (!currentUser) { 
                res.sendStatus( 401 ); 
                return ; 
            } 
            userId = currentUser._id; 
        } 
        const courses = courseDao.findCoursesForEnrolledUser(userId); 
        res.json(courses); 
    }; 
    const findAllCourses = (req, res) => { 
        const courses = courseDao.findAllCourses(); 
        res.json(courses); 
    }; 
    const createCourse = (req, res) => { 
        const currentUser = req.session[ "currentUser" ]; 
        const newCourse = courseDao.createCourse(req.body); 
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id); 
        res.json(newCourse); 
    }; 
    app.post( "/api/users/current/courses" , createCourse);
    app.get( "/api/users/:userId/courses" , findCoursesForEnrolledUser);
    app.get( "/api/users/courses" , findAllCourses);
    app.post( "/api/users" , createUser); 
    app.get( "/api/users" , findAllUsers); 
    app.get( "/api/users/:userId" , findUserById); 
    app.put( "/api/users/:userId" , updateUser); 
    app.delete( "/api/users/:userId" , deleteUser); 
    app.post( "/api/users/signup" , signup); 
    app.post( "/api/users/signin" , signin); 
    app.post( "/api/users/signout" , signout); 
    app.post( "/api/users/profile" , profile); 
    app.put( "/api/users/profile", updateProfile);
}