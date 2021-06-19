var express = require( 'express' );
var router = express.Router();

/* GET home page. */
router.get( '/home', function ( req, res )
{
  let filepath = __dirname + "/public/index.html";
  res.sendFile( filepath );
} );

router.get( '/dashboard', function ( req, res )
{
  if ( req.session && req.session.user )
    res.sendFile( __dirname + "/public/html/dashboard.html" );
  else
    res.redirect( '/' );
} );

module.exports = router;
