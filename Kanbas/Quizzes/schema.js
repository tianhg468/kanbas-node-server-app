import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: { type: String },
  title: { type: String },
  points: { type: Number, default: 1 },
  text: { type: String },
  type: { 
    type: String,
    enum: ["Multiple Choice", "True/False", "Fill in the Blank"],
    required: true 
  },
  question: { type: String},
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  options: [String],
  order: { type: Number}
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
  _id: { type: String},
  quizId: { type: String},
  userId: { type: String },
  startTime: { type: String},
  endTime: { type: String },
  score: { type: Number, default: 0 },
  answers: [{
    questionId: { type: String },
    selectedAnswer: { type: String, default: null },
    points: { type: Number, required: true },
    correct: { type: Boolean, required: true },
  }],
  completed: { type: Boolean, default: false }
}, { collection: "quiz_attempts" });



export { quizSchema, attemptSchema };