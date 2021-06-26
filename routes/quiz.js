var express = require( 'express' );
var router = express.Router();
var quiz = require( '../bin/Backend/lib/quiz' );
const {body, validationResult, check} = require( 'express-validator' );

// TODO: validate the questions, options and correctAnswer

router.post( '/quiz/create', quiz.createQuiz ); //
router.get( '/quiz/:quizCode', quiz.getQuiz );
router.post( '/quiz/submit', quiz.submitQuiz );
router.get( '/quiz/leaderboard/:quizCode', quiz.leaderboard );
router.get( '/quiz/participated/:userId', quiz.getParticipatedQuiz );
router.get( '/quiz/myquizzes/all/:userId', quiz.getAuthoredQuizDetails );
router.get( '/quiz/myquizzes/:quizCode', quiz.getAuthoredQuiz );
router.patch( '/quiz/update', quiz.updateQuiz ); //
router.delete( '/quiz/delete/:quizCode', quiz.deleteQuiz );


module.exports = router;
