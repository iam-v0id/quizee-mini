const User = require( "../models/user" );
const {body, validationResult} = require( 'express-validator' );

module.exports =
{
    register: async ( req, res ) =>
    {
        const errors = validationResult( req );
        if ( !errors.isEmpty() )
        {
            return res.json( {success: false, error: errors.errors[0].msg} );
        }
        var user = new User( req.body );
        try
        {
            await user.save();
            return res.json( {success: true, email: user.email, firstname: user.firstname, lastname: user.lastname, _id: user._id} );
        }
        catch ( err )
        {
            return res.json( {success: false, error: "Email already Registered"} );
        }
    },

    login: async ( req, res ) =>
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
                try
                {
                    let userObject = await User.findOne( {email: userobj.email} );
                    if ( !userObject )
                    {
                        var newuser = new User( userobj );
                        try
                        {
                            let user = await newuser.save();
                            req.session.user = {userId: user._id};
                            return res.json( {success: true, email: user.email, firstname: user.firstname, lastname: user.lastname, _id: user._id} );
                        }
                        catch ( err )
                        {
                            return res.json( {success: false, message: "Unable to add user to DB", error: err} );
                        }
                    }
                    else
                    {
                        req.session.user = {userId: userObject._id};
                        return res.json( {success: true, email: userObject.email, firstname: userObject.firstname, lastname: userObject.lastname, _id: userObject._id} );
                    }
                }
                catch ( err )
                {
                    return res.json( {success: false, message: "Unable to add user to DB", error: err} );
                }
            }
            verify().catch( console.error );
        }
        else
        {
            try
            {
                let user = await User.findOne( {email: req.body.email} );
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
            }
            catch ( err )
            {
                return res.json( {success: false, error: err} );
            }
        }
    },

    logout: ( req, res ) =>
    {
        req.session.destroy();
        res.clearCookie( 'connect.sid' );
        return res.redirect( '/' );
    }
}