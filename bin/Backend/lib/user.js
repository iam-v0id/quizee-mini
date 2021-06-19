const User = require( "../models/user" );

module.exports.register = function ( req, res )
{
    console.log( req.body );
    var user = new User( req.body );
    user.save( ( err, user ) =>
    {
        if ( err ) return res.json( {success: false, error: err} );
        res.json( {success: true, email: user.email, firstname: user.firstname, lastname: user.lastname} );
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
            User.findOne( {email: userobj.email}, ( err, collection ) =>
            {
                if ( !collection )
                {
                    var user = new User( userobj );
                    user.save( ( err, user ) =>
                    {
                        if ( err ) return res.json( {success: false, message: "Unable to add user to DB", error: err} );
                        res.json( {success: true, email: user.email, firstname: user.firstname, lastname: user.lastname} );
                    } );
                }
            } );

            req.session.user = {email: userobj.email, firstname: userobj.firstname, lastname: userobj.lastname};
            res.json( {success: true, email: userobj.email, firstname: userobj.firstname, lastname: userobj.lastname} );
        }
        verify().catch( console.error );
    }
    else
    {
        User.findOne( {email: req.body.email}, ( err, user ) =>
        {
            if ( err )
                res.json( {success: false, error: err} );
            if ( user )
            {
                if ( user.authenticate( req.body.password ) )
                {
                    req.session.user = {email: user.email, firstname: user.firstname, lastname: user.lastname};
                    res.json( {success: true, email: user.email, firstname: user.firstname, lastname: user.lastname} );
                }
                else
                    res.json( {success: false, message: "Incorrect Password"} );
            }
            else
                res.json( {success: false, message: "User Not Registered"} );
        } );
    }
}

module.exports.logout = function ( req, res )
{
    req.session.destroy();
    res.clearCookie( 'connect.sid' );
    res.redirect( '/' );
}