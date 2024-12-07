import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        _id: { type: String },  // Remove required to let Mongoose handle it
        course: { type: String, ref: "CourseModel", required: true },
        user: { type: String, ref: "UserModel", required: true },
        grade: Number,
        letterGrade: String,
        enrollmentDate: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["ENROLLED", "DROPPED", "COMPLETED"],
            default: "ENROLLED"
        }
    },
    { 
        collection: "enrollments"
    }
);

enrollmentSchema.pre('save', function(next) {
    if (!this._id) {
        this._id = `ENR${Date.now()}`;
    }
    next();
});

export default enrollmentSchema;

