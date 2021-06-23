const Quiz = require( '../models/quiz' );
const User = require( "../models/user" );
const Question = require( "../models/question" );


module.exports.createQuiz = async function ( req, res )
{
    req.body.questions = eval( req.body.questions );
    questionIds = [];
    req.body.questions.forEach( function ( question )
    {

        var ques = new Question( question );
        ques.save( ( err, qs ) =>
        {
            console.log( qs );
            if ( err )
                return res.json( {success: false, error: "Unable to add qustion to the database"} );
            else
                questionIds.push( qs._id );
        } );
    } );

    req.body.questions = questionIds;
    console.log( req.body.questions )

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