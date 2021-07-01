var express = require( 'express' );
var router = express.Router();
var quiz = require( '../bin/Backend/controllers/quiz' );

router.post( '/quiz/create', quiz.validate, quiz.createQuiz );
router.get( '/quiz/:quizCode', quiz.getQuiz );
router.post( '/quiz/submit', quiz.submitQuiz );
router.get( '/quiz/leaderboard/:quizCode', quiz.leaderboard );
router.get( '/quiz/participated/:userId', quiz.getParticipatedQuiz );
router.get( '/quiz/myquizzes/all/:userId', quiz.getAuthoredQuizDetails );
router.get( '/quiz/myquizzes/:quizCode', quiz.getAuthoredQuiz );
router.patch( '/quiz/update/:quizCode', quiz.validate, quiz.updateQuiz );
router.delete( '/quiz/delete/:quizCode', quiz.deleteQuiz );

module.exports = router;
