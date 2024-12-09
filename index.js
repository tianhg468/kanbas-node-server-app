import express from 'express';
import mongoose from "mongoose";
import "dotenv/config";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors" ;
import UserRoutes from "./Kanbas/Users/routes.js" ;
import CourseRoutes from "./Kanbas/Courses/routes.js" ;
import ModuleRoutes from "./Kanbas/Modules/routes.js" ;
import AssignmentRoutes from "./Kanbas/Assignments/routes.js" ;
import EnrollmentRoutes from "./Kanbas/Enrollments/routes.js" ;
import QuizRoutes from './Kanbas/Quizzes/routes.js';
import "dotenv/config" ;
import session from "express-session" ;
import MongoStore from 'connect-mongo';


const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas"
mongoose.connect(CONNECTION_STRING);
const app = express();
app.use( 
    cors({ 
        credentials: true , 
        origin: process.env.NETLIFY_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }) 
);

const sessionOptions = { 
    secret: process.env.SESSION_SECRET || "kanbas", 
    resave: false , 
    saveUninitialized: false , 
    store: MongoStore.create({
        mongoUrl: CONNECTION_STRING,
        ttl: 24 * 60 * 60 // Session TTL in seconds (1 day)
    }),
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    }
}; 
if (process.env.NODE_ENV !== "development" ) { 
    sessionOptions.proxy = true ; 
    sessionOptions.cookie = { 
        sameSite: "none" , 
        secure: true , 
        domain: process.env.NODE_SERVER_DOMAIN, 
    }; 
} 
app.use(session(sessionOptions));
app.use(express.json());
Hello(app);
Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
QuizRoutes(app);


app.listen(process.env.PORT || 4000);