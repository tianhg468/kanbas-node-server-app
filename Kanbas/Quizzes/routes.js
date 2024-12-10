import * as quizDao from "./dao.js";
import mongoose from "mongoose";
import express from "express";

function isAnswerCorrect(question, answer) {
  if (!question || !question.type) {
    return false;
  }
  switch (question.type) {
    case "TRUE_FALSE":
      return answer === question.correctAnswer;
    case "MULTIPLE_CHOICE":
      return answer === question.correctAnswer;
    case "FILL_IN_BLANK":
      if (Array.isArray(question.correctAnswer)) {
        return question.correctAnswer.some(
          correct => correct.toLowerCase() === answer.toLowerCase()
        );
      }
      return question.correctAnswer.toLowerCase() === answer.toLowerCase();
    default:
      return false;
  }
}

export default function QuizRoutes(app) {
  // Get all quizzes for a course
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    const { courseId } = req.params;
    console.log("courseId", courseId);
    const quizzes = await quizDao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  });

  // Get a specific quiz
  app.get("/api/courses/:courseId/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    try {
      const quiz = await quizDao.findQuizById(quizId);
      if (quiz) {
        res.json(quiz);
      } else {
        res.status(404).send({ error: "Quiz not found" });
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ error: "Error fetching quiz details" });
    }
  });

  // Create a new quiz
  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    const { courseId } = req.params;
    const quiz = {
      ...req.body,
      course: courseId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    const newQuiz = await quizDao.createQuiz(quiz);
    res.status(201).json(newQuiz);
  });

  // Update a quiz
  app.put("/api/courses/:courseId/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    const updatedQuiz = await quizDao.updateQuiz(quizId, quizUpdates);
    if (updatedQuiz) {
      res.json(updatedQuiz);
    } else {
      res.status(404).send({ error: "Quiz not found" });
    }
  });

  // Delete a quiz
  app.delete("/api/courses/:courseId/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    const success = await quizDao.deleteQuiz(quizId);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ error: "Quiz not found" });
    }
  });

  // Start a quiz attempt
  app.post("/api/courses/:courseId/quizzes/:quizId/attempts", async (req, res) => {
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    console.log("Request path:", req.path);
    const { quizId, courseId} = req.params;
    const { userId } = req.body;
  
    if (!courseId || !quizId || !userId) {
        throw new Error('Invalid courseId, quizId, or userId');
      }
  
    try {
        console.log("waiting 2");
      const quiz = await quizDao.findQuizById(quizId);
      console.log("quiz:", quiz);
      if (!quiz) {
        return res.status(404).send({ error: "Quiz not found" });
      }
  
      if (!quiz.published) {
        return res.status(400).send({ error: "Quiz is not available" });
      }
  
    //   const attemptCount = await quizDao.getAttemptCount(quizId, userId);
    //   console.log("attemptCount", attemptCount, quiz.maxAttempts);
    //   if (quiz.multipleAttempts && attemptCount >= quiz.maxAttempts) {
    //     return res.status(400).send({ error: "Maximum attempts reached" });
    //   }
  
      const attempt = await quizDao.createQuizAttempt({
        quizId,
        userId,
        startTime: new Date().toISOString(),
        answers: []
      });
      console.log("attempt", attempt);
  
      res.status(201).json(attempt);
    } catch (error) {
      console.error("Error starting quiz attempt:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });


  // Submit quiz attempt
  app.post("/api/courses/:courseId/quizzes/:quizId/attempts/:attemptId/submit", 
    async (req, res) => {
      const { attemptId, quizId } = req.params;
      const { answers, score } = req.body;

      const [attempt, quiz] = await Promise.all([
        quizDao.findAttemptById(attemptId),
        quizDao.findQuizById(quizId)
      ]);

      if (!attempt || !quiz) {
        return res.status(404).send({ error: "Attempt or quiz not found" });
      }

      let totalPoints = 0;
      const gradedAnswers = answers.map(answer => {
        const question = quiz.questions.find(q => q._id === answer.questionId);
        const correct = isAnswerCorrect(question, answer.answer);
        if (correct) {
          totalPoints += question.points;
        }
        return { ...answer, correct };
      });

      const updatedAttempt = await quizDao.updateQuizAttempt(attemptId, {
        answers: gradedAnswers,
        score: totalPoints,
        endTime: new Date().toISOString(),
        completed: true
      });

      res.json(updatedAttempt);
    });

  // Get quiz attempts for a user
  app.get("/api/courses/:courseId/quizzes/:quizId/attempts", async (req, res) => {
    const { quizId } = req.params;
    const { userId } = req.query;
    const attempts = await quizDao.findAttemptsByQuizAndUser(quizId, userId);
    res.json(attempts);
  });

// Update the route URL to use consistent casing
app.post("/api/courses/:cid/quizzes/:qid/details/questions", async (req, res) => {
    const { cid, qid } = req.params;
    const question = req.body;
    console.log("question: ", question);
    try {
      // Validate required fields
      if (!question.type || !question.text) {
        console.log("question fields");
        return res.status(400).json({ 
          error: "Question must include type and text" 
        });
      }
  
      // Validate question type
      const validTypes = ["True/False", "Multiple Choice", "Fill in the Blank"];
      if (!validTypes.includes(question.type)) {
        console.log("question type");
        return res.status(400).json({ 
          error: "Invalid question type" 
        });
      }
  
      const newQuestion = await quizDao.createQuestion(qid, question);
      res.status(201).json(newQuestion);
  
    } catch (error) {
      // Log the full error for debugging
      console.error("Error creating question:", error);
  
      // Send appropriate error response based on error type
      if (error.message === "Quiz not found") {
        res.status(404).json({ error: "Quiz not found" });
      } else {
        res.status(500).json({ 
          error: "Error creating question",
          details: error.message 
        });
      }
    }
  });

   // Get all questions for a specific quiz
app.get("/api/courses/:courseId/Quizzes/:quizId/details/questions", async (req, res) => {
    const { quizId } = req.params;
    try {
      const quiz = await quizDao.findQuestionsForQuiz(quizId);
      if (quiz && quiz.questions) {
        res.json(quiz.questions);
      } else {
        res.status(404).send({ error: "Questions not found" });
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).send({ error: "Error fetching questions" });
    }
  });
  

  app.delete("/api/courses/:courseId/quizzes/:qid/questions/:questionId", async (req, res) => {
    const { qid, questionId } = req.params;

    try {
      const success = await quizDao.deleteQuestion(qid, questionId);
      if (success) {
        res.sendStatus(204);
      } else {
        res.status(404).send({ error: "Question not found" });
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).send({ error: "Error deleting question" });
    }
  });

  // Update a question
app.put("/api/courses/:cid/quizzes/:qid/details/questions/:questionId", async (req, res) => {
    const { qid, questionId } = req.params;
    const question = req.body;
  
    try {
      // Validate required fields
      if (!question.type || !question.text) {
        return res.status(400).json({ 
          error: "Question must include type and text" 
        });
      }
  
      // Validate question type
      const validTypes = ["True/False", "Multiple Choice", "Fill in the Blank"];
      if (!validTypes.includes(question.type)) {
        return res.status(400).json({ 
          error: "Invalid question type" 
        });
      }
  
      const updatedQuestion = await quizDao.updateQuestion(qid, questionId, question);
      res.json(updatedQuestion);
  
    } catch (error) {
      console.error("Error updating question:", error);
  
      if (error.message === "Quiz not found") {
        res.status(404).json({ error: "Quiz not found" });
      } else if (error.message === "Question not found") {
        res.status(404).json({ error: "Question not found" });
      } else {
        res.status(500).json({ 
          error: "Error updating question",
          details: error.message 
        });
      }
    }
  });
}