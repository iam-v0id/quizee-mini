const mongoose = require( "mongoose" );
const User = require( "./user" );


const QuizSchema = new mongoose.Schema( {
    quizName: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
    quizDuration: {
        type: Number,
    },
    questions: [
        {
            description: {
                type: String,
                required: true,
            },
            options: [
                String
            ],
            correctAnswer: {
                type: Number,
                required: true,
            }
        },
    ],
    usersParticipated: [
        {
            userId: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
            marks: {type: Number},
            responses: [Number],
            timeEnded: {type: Number},
            timeStarted: {type: Number}
        },
    ],
    isDeleted: {type: Boolean, default: false}
}, {timestamps: true} );
QuizSchema
    .virtual( "quizCode" )
    .get( function ()
    {
        return this._id;
    } );

module.exports = mongoose.model( "Quiz", QuizSchema );