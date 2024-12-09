import * as quizDao from "./dao.js";

function isAnswerCorrect(question, answer) {
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
    const quiz = await quizDao.findQuizById(quizId);
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).send({ error: "Quiz not found" });
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
    const { quizId } = req.params;
    const { userId } = req.body;

    const quiz = await quizDao.findQuizById(quizId);
    if (!quiz) {
      return res.status(404).send({ error: "Quiz not found" });
    }

    if (!quiz.published) {
      return res.status(400).send({ error: "Quiz is not available" });
    }

    const attemptCount = await quizDao.getAttemptCount(quizId, userId);
    if (quiz.multipleAttempts && attemptCount >= quiz.maxAttempts) {
      return res.status(400).send({ error: "Maximum attempts reached" });
    }

    const attempt = await quizDao.createQuizAttempt({
      quizId,
      userId,
      startTime: new Date().toISOString(),
      answers: []
    });
    res.status(201).json(attempt);
  });

  // Submit quiz attempt
  app.post("/api/courses/:courseId/quizzes/:quizId/attempts/:attemptId/submit", 
    async (req, res) => {
      const { attemptId, quizId } = req.params;
      const { answers } = req.body;

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

  app.post("/api/courses/:courseId/quizzes/:quizId/questions", async (req, res) => {
    const { courseId, quizId } = req.params;
    const question = req.body;

    try {
      const newQuestion = await quizDao.createQuestion(quizId, question);
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).send({ error: "Error creating question" });
    }
  });

  app.delete("/api/courses/:courseId/quizzes/:quizId/questions/:questionId", async (req, res) => {
    const { quizId, questionId } = req.params;

    try {
      const success = await quizDao.deleteQuestion(quizId, questionId);
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
}