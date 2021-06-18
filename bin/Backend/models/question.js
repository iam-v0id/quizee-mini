const mongoose = require( "mongoose" );
const questionSchema = new mongoose.Schema( {
	description: {
		type: String,
		required: true,
	},
	options: [
		{
			text: {
				type: String,
				required: true,
			},
		},
	],
	correctAnswer: {
		type: String,
		required: true,
	},
} );

module.exports = mongoose.model( "Question", questionSchema );