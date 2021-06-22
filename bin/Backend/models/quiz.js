const mongoose = require( "mongoose" );
const User = require( "./user" );
const Question = require( "./question" );


const QuizSchema = new mongoose.Schema( {
    quizName: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
    quizDuration: {
        type: Number,
    },
    questions: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Question"},
    ],
    usersParticipated: [
        {
            userId: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
            marks: {type: Number},
            responses: [],
            timeEnded: {type: Number},
            timeStarted: {type: Number}
        },
    ]
}, {timestamps: true} );
QuizSchema
    .virtual( "quizCode" )
    .get( function ()
    {
        return this._id;
    } );

module.exports = mongoose.model( "Quiz", QuizSchema );