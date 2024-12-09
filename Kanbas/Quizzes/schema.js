import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  points: { type: Number, required: true, default: 1 },
  type: { 
    type: String,
    enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
    required: true 
  },
  question: { type: String, required: true },
  correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  choices: [String],
  order: { type: Number, required: true }
});

const quizSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  course: { type: String, required: true },
  type: { 
    type: String,
    enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
    default: "GRADED_QUIZ"
  },
  points: { type: Number, default: 0 },
  assignmentGroup: { 
    type: String,
    enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
    default: "QUIZZES"
  },
  shuffleAnswers: { type: Boolean, default: true },
  timeLimit: { type: Number, default: 20 },
  multipleAttempts: { type: Boolean, default: false },
  maxAttempts: { type: Number, default: 1 },
  showCorrectAnswers: { type: Boolean, default: true },
  accessCode: { type: String },
  oneQuestionAtTime: { type: Boolean, default: true },
  webcamRequired: { type: Boolean, default: false },
  lockQuestionsAfterAnswering: { type: Boolean, default: false },
  dueDate: { type: String, required: true },
  availableFrom: { type: String, required: true },
  availableUntil: { type: String, required: true },
  published: { type: Boolean, default: false },
  questions: [questionSchema]
}, { collection: "quizzes" });

const attemptSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  quizId: { type: String, required: true },
  userId: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  score: { type: Number, default: 0 },
  answers: [{
    questionId: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed },
    correct: { type: Boolean }
  }],
  completed: { type: Boolean, default: false }
}, { collection: "quiz_attempts" });

export { quizSchema, attemptSchema };