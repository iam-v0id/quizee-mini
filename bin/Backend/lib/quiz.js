const Quiz = require( '../models/quiz' );
const user = require( '../models/user' );
const User = require( "../models/user" );
const async = require( "async" );

module.exports.createQuiz = function ( req, res )
{
    req.body.questions = eval( req.body.questions );

    var quiz = new Quiz( req.body );
    quiz.save( ( err, quizobj ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Unable to add quiz to the database"} );
        else
        {
            User.updateOne( {_id: req.body.author}, {$push: {quizzesAuthored: {quizCode: quizobj._id}}} );
            return res.json( {success: true, quizCode: quizobj.quizCode} );
        }
    } );
}

module.exports.getQuiz = function ( req, res )
{
    var quizCode = req.params.quizCode;

    Quiz.findById( quizCode, {quizName: 1, author: 1, quizDuration: 1, questions: {options: 1, description: 1}}, ( err, quiz ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Unable to fetch quiz from the database"} );
        else
        {
            return res.json( {success: true, quiz: quiz} );
        }
    } );
}

module.exports.submitQuiz = function ( req, res )
{
    req.body.responses = eval( req.body.responses );

    console.log( req.body );
    var marks = 0;
    Quiz.findById( req.body.quizCode, {questions: {correctAnswer: 1}}, ( err, collection ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Unable to evaluate responses"} );
        else
        {
            for ( let i = 0; i < req.body.responses.length; i++ )
            {
                if ( req.body.responses[i] == 0 )
                    continue;
                if ( collection.questions[i].correctAnswer == req.body.responses[i] )
                    marks = marks + 1;
            }
            var submission = {
                userId: req.body.userId,
                marks: marks,
                responses: req.body.responses,
                timeEnded: req.body.timeEnded,
                timeStarted: req.body.timeStarted
            };
            Quiz.updateOne( {quizCode: req.body.quizCode}, {$push: {usersParticipated: submission}} );
            User.updateOne( {userId: req.body.userId}, {$push: {quizzesParticipated: {quizCode: quizCode}}} );
            return res.json( {success: true, marks: marks} );
        }
    } );
}

function getQuizDetails( collection, cb )
{

    var quizDetails = [];
    async.eachSeries( collection, function ( quiz, next )
    {
        Quiz.findById( quiz.quizCode, {quizName: 1, author: 1, quizDuration: 1}, ( err, quizobj ) =>
        {
            if ( err )
                return res.json( {success: false, error: "Unable to fetch quiz details"} );
            else
                quizDetails.push( quizobj );
            next();
        } );

    }, function ()
    {
        cb( quizDetails );
    } );
}

module.exports.getParticipatedQuiz = function ( req, res )
{
    User.findById( req.params.userId, {quizzesParticipated: 1}, ( err, collection ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Unable to fetch quizzes participated"} );
        else
        {
            getQuizDetails( collection.quizzesParticipated, ( quizDetails ) =>
            {
                return res.json( {success: true, quizDetails: quizDetails} );
            } );
        }
    } );
}

function getLeaderboard( collection, cb )
{
    var leaderboard = [];

    async.eachSeries( collection, function ( userobj, next )
    {
        User.findById( userobj.userId, {firstname: 1, lastname: 1, email: 1}, ( err, user ) => 
        {
            if ( err )
                return res.json( {success: false, error: "Unable to fetch the participants Info"} );
            else
            {
                leaderboard.push( {email: user.email, firstname: user.firstname, lastname: user.lastname, _id: user._id, marks: userobj.marks} );
            }
            next();
        } );
    }, function ()
    {
        cb( leaderboard );
    } );
}

module.exports.leaderboard = function ( req, res )
{

    Quiz.findById( req.params.quizCode, {usersParticipated: {userId: 1, marks: 1}}, ( err, collection ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Unable to fetch the participants"} );
        else
        {
            getLeaderboard( collection.usersParticipated, ( leaderboard ) =>
            {
                return res.json( {success: true, leaderboard: leaderboard} );
            } );
        }
    } );
}

module.exports.getAuthoredQuizDetails = function ( req, res )
{
    User.findById( req.params.userId, {quizzesAuthored: 1}, ( err, collection ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Unable to fetch quizzes Authored"} );
        else
        {
            getQuizDetails( collection.quizzesAuthored, ( quizDetails ) =>
            {
                return res.json( {success: true, quizDetails: quizDetails} );
            } );
        }
    } );
}

module.exports.getAuthoredQuiz = function ( req, res )
{
    User.findById( req.params, quizCode, {}, ( err, quiz ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Unable to fetch quizzes Authored"} );
        else
            return res.json( {success: true, quiz: quiz} );
    } );
}

module.exports.updateQuiz = function ( req, res )
{
    req.body.update.questions = eval( req.body.update.questions );
    Quiz.updateOne( {quizCode: req.body.quizCode}, {$set: req.body.update} );
}

module.exports.deleteQuiz = function ( req, res )
{
    Quiz.updateOne( {quizCode: req.params.quizCode}, {$set: {isDeleted: true}} );
}

