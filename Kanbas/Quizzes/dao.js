import { Quiz, QuizAttempt } from "./model.js";
import mongoose from "mongoose";

export function findAllQuizzes() {
  return Quiz.find();
}

export function findQuizzesForCourse(courseId) {
  return Quiz.find({ course: courseId });
}

// export function findQuizById(quizId) {
//     console.log("waiting 3");
//    const response = Quiz.findById(quizId).exec();
//    console.log(response);
//    return response;
// }
export async function findQuizById(quizId) {
    try {
      console.log("Finding quiz with ID:", quizId);
      const quiz = await Quiz.findById(quizId).exec();
      console.log("Found quiz:", quiz);
      
      if (!quiz) {
        console.log("No quiz found with ID:", quizId);
        return null;
      }
      
      return quiz;
    } catch (error) {
      console.error("Error finding quiz:", error);
      throw error;
    }
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
      _id: new mongoose.Types.ObjectId(), 
      ...attempt,
    });
    return newAttempt.save();
  }


  export const submitQuizAttempt = async (req, res) => {
    try {
      const { courseId, quizId, attemptId } = req.params;
      const { answers, totalScore } = req.body;
  
      const attempt = await QuizAttempt.findById(attemptId);
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
  
      // Verify the totalScore matches the sum of correct answer points
      const calculatedScore = answers.reduce((sum, answer) => 
        sum + (answer.correct ? answer.points : 0), 0
      );
  
      if (calculatedScore !== totalScore) {
        return res.status(400).json({ 
          message: "Score verification failed" 
        });
      }
  
      attempt.answers = answers;
      attempt.totalScore = totalScore;
      attempt.endTime = new Date();
      
      const savedAttempt = await attempt.save();
  
      res.json({
        id: savedAttempt._id,
        totalScore: savedAttempt.totalScore,
        endTime: savedAttempt.endTime
      });
    } catch (error) {
      console.error("Error submitting quiz attempt:", error);
      return res.status(500).json({ message: "Error submitting quiz attempt" });
    }
  };
  export const getQuizAttempts = async (req, res) => {
    try {
      const { courseId, quizId } = req.params;
      const { userId } = req.query;
  
      const attempts = await QuizAttempt.find({
        quiz: quizId,
        user: userId
      }).sort({ startTime: -1 });
  
      const formattedAttempts = attempts.map(attempt => ({
        _id: attempt._id,
        totalScore: attempt.totalScore,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
        answers: attempt.answers
      }));
  
      res.json(formattedAttempts);
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
      return res.status(500).json({ message: "Error fetching quiz attempts" });
    }
  };
  

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
  
    const questionIndex = quiz.questions.findIndex(
        q => q._id && q._id.toString() === questionId.toString()
      );
  
    quiz.questions.splice(questionIndex, 1);
    await quiz.save();
    return true;
  }

  export function findQuestionsForQuiz(quizId) {
    return Quiz.findById(quizId).select("questions");
  }

  export async function updateQuestion(quizId, questionId, questionUpdates) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
  
    const questionIndex = quiz.questions.findIndex(
      q => q._id && q._id.toString() === questionId.toString()
    );
  
    if (questionIndex === -1) {
      throw new Error("Question not found");
    }
  
    quiz.questions[questionIndex] = {
      _id: questionId,
      ...questionUpdates
    };
  
    await quiz.save();
    return quiz.questions[questionIndex];
  }
  