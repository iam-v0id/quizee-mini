const mongoose = require( "mongoose" );
const User = require( "./user" );
const Question = require( "./question" );

const QuizSchema = new mongoose.Schema( {
    quizName: {type: String, required: true},
    quizCode: {type: String},
    author: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
    delay: {type: Number, required: true},
    questions: [
        {
            questionId: {type: mongoose.Schema.Types.ObjectId, ref: "Question"},
        },
    ],
    usersParticipated: [
        {
            userId: {type: mongoose.Schema.Types.ObjectID, ref: "User"},
            marks: {type: Number},
            responses: [],
            timeEnded: {type: Number},
            timeStarted: {type: Number}
        },
    ],
    quizDuration: {
        type: String,
    },
} );

module.exports = mongoose.model( "Quiz", QuizSchema );