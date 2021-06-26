const User = require( "../models/user" );
const {body, validationResult} = require( 'express-validator' );
module.exports.register = function ( req, res )
{
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        return res.json( {success: false, error: errors.errors[0].msg} );
    }
    var user = new User( req.body );
    user.save( ( err, user ) =>
    {
        if ( err )
            return res.json( {success: false, error: "Email already Registered"} );
        else
            return res.json( {success: true, email: user.email, firstname: user.firstname, lastname: user.lastname, _id: user._id} );
    } );
}

module.exports.login = function ( req, res )    
{
    if ( req.body.credential )
    {
        const {OAuth2Client} = require( 'google-auth-library' );
        const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );
        async function verify()
        {
            const ticket = await client.verifyIdToken( {
                idToken: req.body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            } );
            const payload = ticket.getPayload();
            userobj = {firstname: payload['given_name'], lastname: payload['family_name'], email: payload['email']}
            User.findOne( {email: userobj.email}, ( err, userObject ) =>
            {
                if ( err )
                    return res.json( {success: false, message: "Unable to add user to DB", error: err} );
                if ( !userObject )
                {
                    var user = new User( userobj );
                    user.save( ( err, user ) =>
                    {
                        if ( err )
                            return res.json( {success: false, message: "Unable to add user to DB", error: err} );
                        else
                        {
                            req.session.user = {userId: user._id};
                            return res.json( {success: true, email: user.email, firstname: user.firstname, lastname: user.lastname, _id: user._id} );
                        }
                    } );
                }
                else
                {
                    req.session.user = {userId: userObject._id};
                    return res.json( {success: true, email: userObject.email, firstname: userObject.firstname, lastname: userObject.lastname, _id: userObject._id} );
                }
            } );
        }
        verify().catch( console.error );
    }
    else
    {
        User.findOne( {email: req.body.email}, ( err, user ) =>
        {
            if ( err )
                return res.json( {success: false, error: err} );
            if ( user )
            {
                if ( user.authenticate( req.body.password ) )
                {
                    req.session.user = {userId: user._id};
                    return res.json( {success: true, email: user.email, firstname: user.firstname, lastname: user.lastname, _id: user._id} );
                }
                else
                    return res.json( {success: false, message: "Incorrect Password"} );
            }
            else
                return res.json( {success: false, message: "User Not Registered"} );
        } );
    }
}

module.exports.logout = function ( req, res )
{
    req.session.destroy();
    res.clearCookie( 'connect.sid' );
    return res.redirect( '/' );
}