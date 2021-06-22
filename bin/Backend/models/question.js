const mongoose = require( "mongoose" );
const questionSchema = new mongoose.Schema( {
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
	},
} );

module.exports = mongoose.model( "Question", questionSchema );
