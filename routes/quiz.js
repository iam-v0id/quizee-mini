var express = require( 'express' );
var router = express.Router();
var quizLib = require( '../bin/Backend/lib/quiz' );
const {body, validationResult, check} = require( 'express-validator' );


// TODO: I cannot allow anyone to messup anyones quizzes
// TODO: have a look at params 

router.post( '/quiz/create', quizLib.createQuiz );
router.get( '/quiz/:quizCode', quizLib.getQuiz );
router.post( '/quiz/submit', quizLib.submitQuiz );
router.get( '/quiz/leaderboard/:quizCode', quizLib.leaderboard );
router.get( '/quiz/leaderboard', quizLib.getParticipatedQuiz );
router.get( '/quiz/myquizzes', quizLib.getAuthoredQuizDetails );
router.get( '/quiz/myquizzes:/quizCode', quizLib.getAuthoredQuiz );
router.post( '/quiz/update', quizLib.updateQuiz );
router.delete( '/quiz/delete/:quizCode', quizLib.deleteQuiz );



module.exports = router;
