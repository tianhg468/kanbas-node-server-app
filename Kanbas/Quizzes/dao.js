import { Quiz, QuizAttempt } from "./model.js";
import mongoose from "mongoose";

export function findAllQuizzes() {
  return Quiz.find();
}

export function findQuizzesForCourse(courseId) {
  return Quiz.find({ course: courseId });
}

export function findQuizById(quizId) {
  return Quiz.findById(quizId);
}

export function createQuiz(quiz) {
  const newQuiz = new Quiz({
    _id: new mongoose.Types.ObjectId().toHexString(),
    ...quiz,
    questions: quiz.questions?.map(q => ({
      _id: new mongoose.Types.ObjectId().toHexString(),
      ...q
    }))
  });
  return newQuiz.save();
}

export function updateQuiz(quizId, quizUpdates) {
  return Quiz.findByIdAndUpdate(quizId, quizUpdates, { new: true });
}

export function deleteQuiz(quizId) {
  return Quiz.findByIdAndDelete(quizId);
}

// Quiz Attempt operations
export function createQuizAttempt(attempt) {
  const newAttempt = new QuizAttempt({
    _id: new mongoose.Types.ObjectId().toHexString(),
    ...attempt
  });
  return newAttempt.save();
}

export function findAttemptById(attemptId) {
  return QuizAttempt.findById(attemptId);
}

export function findAttemptsByQuizAndUser(quizId, userId) {
  return QuizAttempt.find({ quizId, userId });
}

export function updateQuizAttempt(attemptId, updates) {
  return QuizAttempt.findByIdAndUpdate(attemptId, updates, { new: true });
}

export function getAttemptCount(quizId, userId) {
  return QuizAttempt.countDocuments({
    quizId,
    userId,
    completed: true
  });
}

export async function createQuestion(quizId, question) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
  
    const newQuestion = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      ...question
    };
  
    quiz.questions.push(newQuestion);
    await quiz.save();
    return newQuestion;
  }

  export async function deleteQuestion(quizId, questionId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
  
    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex === -1) {
      return false;
    }
  
    quiz.questions.splice(questionIndex, 1);
    await quiz.save();
    return true;
  }