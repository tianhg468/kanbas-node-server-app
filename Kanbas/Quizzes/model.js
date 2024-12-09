import mongoose from "mongoose";
import { quizSchema, attemptSchema } from "./schema.js";

const Quiz = mongoose.model("QuizModel", quizSchema);
const QuizAttempt = mongoose.model("QuizAttemptModel", attemptSchema);

export { Quiz, QuizAttempt };