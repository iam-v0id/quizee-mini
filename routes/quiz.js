var express = require( 'express' );
var router = express.Router();
var quizLib = require( '../bin/Backend/lib/quiz' );
const {body, validationResult, check} = require( 'express-validator' );

// TODO: validate the questions, options and correctAnswer

router.post( '/quiz/create', quizLib.createQuiz ); //
router.get( '/quiz/:quizCode', quizLib.getQuiz );
router.post( '/quiz/submit', quizLib.submitQuiz );
router.get( '/quiz/leaderboard/:quizCode', quizLib.leaderboard );
router.get( '/quiz/participated/:userId', quizLib.getParticipatedQuiz );
router.get( '/quiz/myquizzes/all/:userId', quizLib.getAuthoredQuizDetails );
router.get( '/quiz/myquizzes/:quizCode', quizLib.getAuthoredQuiz );
router.patch( '/quiz/update', quizLib.updateQuiz ); //
router.delete( '/quiz/delete/:quizCode', quizLib.deleteQuiz );


module.exports = router;
