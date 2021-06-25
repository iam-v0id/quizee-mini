var mongoose = require( 'mongoose' );
const crypto = require( "crypto" );
const Quiz = require( "./quiz" );

var userSchema = new mongoose.Schema( {
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    encry_password: {type: String},
    salt: String,
    quizzesAuthored: [
        {
            quizCode: {type: mongoose.Schema.Types.ObjectId, ref: "Quiz"},
        },
    ],
    quizzesParticipated: [
        {
            quizCode: {type: mongoose.Schema.Types.ObjectId, ref: "Quiz"},
        },
    ],
}, {timestamps: true} );

userSchema
    .virtual( "password" )
    .set( function ( plainPassword )
    {
        this.salt = Date.now();
        this.encry_password = this.securePassword( plainPassword );
    } );

userSchema.methods = {
    securePassword: function ( plainPassword )
    {
        if ( !plainPassword ) return "";
        try
        {
            return crypto
                .createHmac( "sha256", this.salt )
                .update( plainPassword )
                .digest( "hex" );
        } catch ( err )
        {
            console.log( err );
            return "";
        }
    },

    authenticate: function ( plainPassword )
    {
        return this.encry_password === this.securePassword( plainPassword );
    },
};
module.exports = mongoose.model( 'User', userSchema );