const Quiz = require( '../models/quiz' );
const User = require( "../models/user" );
const async = require( "async" );



function getQuizDetails( collection, cb ) {
    console.log(collection);
    var quizDetails = [];
    async.eachSeries( collection, ( quiz, next ) => {
        Quiz.findById( quiz.quizCode, ( err, quizobj ) => {
            if ( err )
                return res.json( {success: false, error: "Unable to fetch quiz details"} );
            else {
                console.log(quizobj);
                User.findById( quizobj.author, function ( err, user ) {
                    if ( err )
                        return res.json( {success: false, error: "Unable to fetch quiz details"} );
                    else {

                        let obj = {
                            quizName: quizobj.quizName,
                            author: user.firstname + " " + user.lastname,
                            quizDuration: quizobj.quizDuration,
                            _id: quizobj._id,
                            usersParticipated: quizobj.usersParticipated.length,
                            author_email: user.email,
                            question_count: quizobj.questions.length
                        };
                        console.log( obj );
                        quizDetails.push( obj );
                        next();
                    }
                } );

            }
        } );

    }, () => {
        cb( quizDetails );
    } );
}

module.exports =
{
    createQuiz: async ( req, res ) => {
        req.body.questions = eval( req.body.questions );
        req.body.author = req.session.user.userId;
        var quiz = new Quiz( req.body );
        try {
            let quizobj = await quiz.save();
            try {
                await User.updateOne( {_id: req.body.author}, {$push: {quizzesAuthored: {quizCode: quizobj._id}}} );
                return res.json( {success: true, quizCode: quizobj.quizCode} );
            }
            catch ( err ) {
                return res.json( {success: false, error: "Unable to update the database"} );
            }
        }
        catch ( err ) {
            return res.json( {success: false, error: "Unable to add quiz to the database"} );
        }

    },

    getQuiz: async ( req, res ) => {
        var quizCode = req.params.quizCode;
        try {
            let quiz = await Quiz.findById( quizCode, {quizName: 1, author: 1, quizDuration: 1, questions: {options: 1, description: 1}, usersParticipated: {userId: 1}} );
            for ( userobj of quiz.usersParticipated )
                if ( userobj.userId == req.session.user.userId ) {
                    console.log( "Already have" );
                    return res.json( {success: false, error: "Already Attempted"} );
                }
            return res.json( {success: true, quiz: quiz} );
        }
        catch ( err ) {
            return res.json( {success: false, error: "Unable to fetch quiz from the database"} );
        }
    },

    submitQuiz: async ( req, res ) => {
        req.body.responses = eval( req.body.responses );
        var marks = 0;

        try {
            let collection = await Quiz.findById( req.body.quizCode, {questions: {correctAnswer: 1}} );
            for ( let i = 0; i < req.body.responses.length; i++ ) {
                if ( req.body.responses[i] == 0 )
                    continue;
                if ( collection.questions[i].correctAnswer == req.body.responses[i] )
                    marks = marks + 1;
            }
            var submission = {
                userId: req.session.user.userId,
                marks: marks,
                responses: req.body.responses,
                timeEnded: req.body.timeEnded,
                timeStarted: req.body.timeStarted
            };
            await Quiz.updateOne( {_id: req.body.quizCode}, {$push: {usersParticipated: submission}} );
            await User.updateOne( {_id: req.session.user.userId}, {$push: {quizzesParticipated: {quizCode: req.body.quizCode}}} );
            return res.json( {success: true, marks: marks} );
        }
        catch ( err ) {
            return res.json( {success: false, error: "Unable to evaluate responses"} );
        }

    },

    getParticipatedQuiz: async ( req, res ) => {
        try {
            let collection = await User.findById( req.params.userId, {quizzesParticipated: 1} );
            getQuizDetails( collection.quizzesParticipated, ( quizDetails ) => {
                return res.json( {success: true, quizDetails: quizDetails} );
            } );
        }
        catch ( err ) {
            return res.json( {success: false, error: "Unable to fetch quizzes participated"} );
        }
    },

    leaderboard: async ( req, res ) => {
        try {
            let collection = await Quiz.findById( req.params.quizCode, {usersParticipated: {userId: 1, marks: 1}} );
            var leaderboard = [];
            for ( var userobj of collection.usersParticipated ) {
                try {
                    let user = await User.findById( userobj.userId, {firstname: 1, lastname: 1, email: 1} );
                    leaderboard.push( {email: user.email, firstname: user.firstname, lastname: user.lastname, _id: user._id, marks: userobj.marks} );
                }
                catch ( err ) {
                    return res.json( {success: false, error: "Unable to fetch the participants Info"} );
                }
            }
            return res.json( {success: true, leaderboard: leaderboard} );
        }
        catch ( err ) {
            return res.json( {success: false, error: "Unable to fetch the participants"} );
        }
    },

    getAuthoredQuizDetails: async ( req, res ) => {
        try {
            let collection = await User.findById( req.params.userId, {quizzesAuthored: 1} );
            getQuizDetails( collection.quizzesAuthored, ( quizDetails ) => {
                return res.json( {success: true, quizDetails: quizDetails} );
            } );
        }
        catch ( err ) {
            return res.json( {success: false, error: "Unable to fetch quizzes Authored"} );
        }
    },

    getAuthoredQuiz: async ( req, res ) => {

        try {
            let collection = await Quiz.findById( req.params.quizCode );
            if ( collection.author == req.session.user.userId ) {
                return res.json( {success: true, quiz: collection} );
            }
            else
                return res.json( {success: false, error: "You are Not Authorized"} );
        }
        catch ( err ) {
            return res.json( {success: false, error: "Unable to verify your Identity"} );
        }
    },

    updateQuiz: async ( req, res ) => {
        console.log(req.body);
        req.body.questions = eval( req.body.questions );

        try {
            let collection = await Quiz.findById( req.params.quizCode, {author: 1} );
            if ( collection.author == req.session.user.userId ) {
                try {
                    await Quiz.updateOne( {_id: req.params.quizCode}, {$set: req.body} );
                    return res.json( {success: true, msg: "Quiz updated successfully"} );
                }
                catch ( err ) {
                    return res.json( {success: false, error: "Unable to update Quiz"} );
                }
            }
            else
                return res.json( {success: false, error: "You are Not Authorized"} );
        }
        catch ( err ) {
            return res.json( {success: false, error: "Unable to verify your Identity"} );
        }
    },

    deleteQuiz: async ( req, res ) => {
        try {
            let collection = await Quiz.findById( req.params.quizCode, {author: 1} );
            if ( collection.author == req.session.user.userId ) {
                try {
                    await Quiz.deleteOne( {_id: req.params.quizCode} );
                    await User.updateOne({_id:collection.author},{$pull: {quizzesAuthored: {quizCode:req.params.quizCode}}});
                    return res.json( {success: true, msg: "Quiz has been deleted"} );
                }
                catch ( err ) {
                    console.log(err);
                    return res.json( {success: false, error: "Unable to delete Quiz"} );
                }
            }
            else
                return res.json( {success: false, msg: "You are Not Authorized"} );
        }
        catch ( err ) {
            return res.json( {success: false, error: "Unable to verify your Identity"} );
        }
    },

    validate: async ( req, res, next ) => {
        var quiz;
        quiz = req.body.update;
        if ( quiz === undefined )
            quiz = req.body;
        quiz.questions = eval( quiz.questions );

        // validate quizDuration
        quiz.quizDuration = parseInt( quiz.quizDuration );
        console.log( quiz.quizDuration );
        if ( isNaN( quiz.quizDuration ) || quiz.quizDuration <= 0 )
            return res.json( {success: false, error: 'Quiz Duration must be a Positive Integer'} );

        // validate options and correctAnswer
        for ( let i = 0; i < quiz.questions.length; i++ ) {
            let s = new Set( quiz.questions[i].options );
            if ( s.size != 4 )
                return res.json( {success: false, error: "Options must be Unique in Question No. " + ( i + 1 )} );
            quiz.questions[i].correctAnswer = parseInt( quiz.questions[i].correctAnswer );
            if ( isNaN( quiz.questions[i].correctAnswer ) || quiz.questions[i].correctAnswer <= 0 || quiz.questions[i].correctAnswer > 4 )
                return res.json( {success: false, error: 'Correct Answer must lie between 1 and 4'} );
        }
        next();
    }

}
