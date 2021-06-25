const Quiz = require( '../models/quiz' );
const User = require( "../models/user" );

module.exports.createQuiz = function ( req, res )
{
    req.body.questions = eval( req.body.questions );
    //req.body.questions[0].options = eval( req.body.questions[0].options );
    //console.log(req.body.questions[0].options);
    var quiz = new Quiz( req.body );
    quiz.save( ( err, quizobj ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Unable to add quiz to the database"} );
        else
        {
            User.updateOne( {_id: req.body.author}, {$push: {quizzesAuthored: {quizId: quizobj._id}}} );
            return res.json( {success: true, quizCode: quizobj.quizCode} );
        }
    } );
}

module.exports.getQuiz = function ( req, res )
{
    var quizCode = req.params.quizCode;
    Quiz.findById( quizCode,{quizName: 1, author: 1, quizDuration: 1, questions: {options: 1, description: 1}}, ( err, quiz ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Unable to fetch quiz from the database"} );
        else
        {
            // TODO: Send only necessary fields to Front End.
            return res.json( {success: true, quiz: quiz} );
        }
    } );
}
