const User = require( "../models/user" );

module.exports.register = function ( req, res )
{
    console.log( req.body );
    var user = new User( req.body );
    user.save( ( err, user ) =>
    {
        if ( err ) return res.json( {sucess: false, message: "Unable to add user to DB", error: err} );
        res.json( {sucess: true, email: user.email} );
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
                        if ( err ) return res.json( {sucess: false, message: "Unable to add user to DB", error: err} );
                        res.json( {sucess: true, email: user.email} );
                    } );
                }
            } );

            req.session.user = {email: userobj.email};
            res.json( {success: true, email: userobj.email} );
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
                    //req.session.user( {email: user.email} );
                    res.json( {success: true, email: user.email} );
                }
                else
                    res.json( {success: false, message: "Incorrect Password"} );
            }
            else
                res.json( {success: false, message: "User Not Found in DB"} );
        } );
    }
}