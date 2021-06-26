const Quiz = require( '../models/quiz' );
const user = require( '../models/user' );
const User = require( "../models/user" );
const async = require( "async" );

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

module.exports =
{
    createQuiz: async function ( req, res )
    {
        req.body.questions = eval( req.body.questions );

        var quiz = new Quiz( req.body );
        try
        {
            let quizobj = await quiz.save();
            try
            {
                await User.updateOne( {_id: req.body.author}, {$push: {quizzesAuthored: {quizCode: quizobj._id}}} );
                return res.json( {success: true, quizCode: quizobj.quizCode} );
            }
            catch ( err )
            {
                return res.json( {success: false, error: "Unable to update the database"} );
            }
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Unable to add quiz to the database"} );
        }

    },

    getQuiz: async function ( req, res )
    {
        var quizCode = req.params.quizCode;
        try
        {
            let quiz = await Quiz.findById( quizCode, {quizName: 1, author: 1, quizDuration: 1, questions: {options: 1, description: 1}} );
            return res.json( {success: true, quiz: quiz} );
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Unable to fetch quiz from the database"} );
        }
    },

    submitQuiz: async function ( req, res )
    {
        req.body.responses = eval( req.body.responses );
        console.log( req.body.userId );
        var marks = 0;

        try
        {
            let collection = await Quiz.findById( req.body.quizCode, {questions: {correctAnswer: 1}} );
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
            await Quiz.updateOne( {_id: req.body.quizCode}, {$push: {usersParticipated: submission}} );
            await User.updateOne( {userId: req.body.userId}, {$push: {quizzesParticipated: {quizCode: req.body.quizCode}}} );
            return res.json( {success: true, marks: marks} );
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Unable to evaluate responses"} );
        }

    },

    getParticipatedQuiz: async function ( req, res )
    {
        try
        {
            let collection = await User.findById( req.params.userId, {quizzesParticipated: 1} );
            getQuizDetails( collection.quizzesParticipated, ( quizDetails ) =>
            {
                return res.json( {success: true, quizDetails: quizDetails} );
            } );
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Unable to fetch quizzes participated"} );
        }
    },

    leaderboard: async function ( req, res )
    {
        try
        {
            let collection = await Quiz.findById( req.params.quizCode, {usersParticipated: {userId: 1, marks: 1}} );
            var leaderboard = [];
            for ( var userobj of collection.usersParticipated )
            {
                try
                {
                    let user = await User.findById( userobj.userId, {firstname: 1, lastname: 1, email: 1} );
                    leaderboard.push( {email: user.email, firstname: user.firstname, lastname: user.lastname, _id: user._id, marks: userobj.marks} );
                }
                catch ( err )
                {
                    return res.json( {success: false, error: "Unable to fetch the participants Info"} );
                }
            }
            return res.json( {success: true, leaderboard: leaderboard} );
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Unable to fetch the participants"} );
        }
    },

    getAuthoredQuizDetails: async function ( req, res )
    {
        try
        {
            let collection = await User.findById( req.params.userId, {quizzesAuthored: 1} );
            getQuizDetails( collection.quizzesAuthored, ( quizDetails ) =>
            {
                return res.json( {success: true, quizDetails: quizDetails} );
            } );
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Unable to fetch quizzes Authored"} );
        }
    },

    getAuthoredQuiz: async function ( req, res )
    {

        try
        {
            let collection = await Quiz.findById( req.params.quizCode, {author: 1} );
            if ( collection.author == req.session.user.userId )
            {
                try
                {
                    let quiz = await User.findById( req.params.quizCode, {} );
                    return res.json( {success: true, quiz: quiz} );
                }
                catch ( err )
                {
                    return res.json( {success: false, error: "Unable to fetch Authored quizzes"} );
                }
            }
            else
                return res.json( {success: false, msg: "You are Not Authorized"} );
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Unable to verify your Identity"} );
        }
    },

    updateQuiz: async function ( req, res )
    {
        req.body.update.questions = eval( req.body.update.questions );

        try
        {
            let collection = await Quiz.findById( req.body.quizCode, {author: 1} );
            if ( collection.author == req.session.user.userId )
            {
                try
                {
                    await Quiz.updateOne( {quizCode: req.body.quizCode}, {$set: req.body.update} );
                    return res.json( {success: true, msg: "Quiz updated successfully"} );
                }
                catch ( err )
                {
                    return res.json( {success: false, error: "Unable to update Quiz"} );
                }
            }
            else
                return res.json( {success: false, msg: "You are Not Authorized"} );
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Unable to verify your Identity"} );
        }
    },

    deleteQuiz: async function ( req, res )
    {
        try
        {
            let collection = await Quiz.findById( req.params.quizCode, {author: 1} );
            if ( collection.author == req.session.user.userId )
            {
                try
                {
                    await Quiz.deleteOne( {quizCode: req.params.quizCode} );
                    return res.json( {success: true, msg: "Quiz has been deleted"} );
                }
                catch ( err )
                {
                    return res.json( {success: false, error: "Unable to delete Quiz"} );
                }
            }
            else
                return res.json( {success: false, msg: "You are Not Authorized"} );
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Unable to verify your Identity"} );
        }
    }
}